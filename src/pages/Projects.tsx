import { useState, useMemo, useCallback } from 'react';
import type { Project } from '@/data/portfolio';
import { useGitHubProjects } from '@/services/githubProjects';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { ProjectModal } from '@/components/portfolio/ProjectModal';
import { formatRelativeTime } from '@/utils/formatters';
import './Projects.scss';

type AccountFilter = 'all' | 'timotheegrollier' | 'stxtxm';
type SortOption = 'updated' | 'stars' | 'name';

export default function Projects() {
    const { projects, loading, lastSync, refresh } = useGitHubProjects();

    const [selectedTag, setSelectedTag] = useState<string>('All');
    const [selectedAccount, setSelectedAccount] = useState<AccountFilter>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortBy, setSortBy] = useState<SortOption>('updated');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const closeModal = useCallback(() => setSelectedProject(null), []);

    // Extract top tags and sort by frequency
    const popularTags = useMemo(() => {
        const counts = new Map<string, number>();
        for (const p of projects) {
            for (const tag of p.tags) {
                counts.set(tag, (counts.get(tag) || 0) + 1);
            }
        }
        return Array.from(counts.entries())
            .sort((a, b) => b[1] - a[1])
            .map((entry) => entry[0])
            .slice(0, 16);
    }, [projects]);

    // Filter & Sort
    const filteredProjects = useMemo(() => {
        let result = projects;

        // Account filter
        if (selectedAccount !== 'all') {
            result = result.filter((p) => p.owner === selectedAccount);
        }

        // Tag filter
        if (selectedTag !== 'All') {
            result = result.filter((p) => p.tags.includes(selectedTag));
        }

        // Search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter((p) => {
                const inName = p.name.toLowerCase().includes(query);
                const inDesc = p.description.toLowerCase().includes(query);
                const inTags = p.tags.some((t) => t.toLowerCase().includes(query));
                const inOwner = p.owner?.toLowerCase().includes(query);
                const inLang = p.language?.toLowerCase().includes(query);
                return inName || inDesc || inTags || inOwner || inLang;
            });
        }

        // Sort
        result = [...result].sort((a, b) => {
            // Keep featured on top unless sorting by name
            if (sortBy !== 'name') {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
            }

            if (sortBy === 'stars') {
                return (b.stars || 0) - (a.stars || 0);
            }
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name);
            }
            // default: updatedAt
            const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
            const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
            return timeB - timeA;
        });

        return result;
    }, [projects, selectedAccount, selectedTag, searchQuery, sortBy]);

    const resetFilters = () => {
        setSelectedTag('All');
        setSelectedAccount('all');
        setSearchQuery('');
        setSortBy('updated');
    };

    return (
        <section className="projects-page" id="projects">
            {/* Header */}
            <header className="projects-page__header">
                <div className="projects-page__eyebrow-row">
                    <span className="live-indicator">
                        <span className="live-pulse" />
                        GitHub Live Sync
                    </span>
                    {lastSync && (
                        <span className="sync-time">
                            Mis à jour {formatRelativeTime(lastSync.toISOString())}
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={() => refresh()}
                        disabled={loading}
                        className={`sync-refresh-btn ${loading ? 'sync-refresh-btn--loading' : ''}`}
                        title="Synchroniser avec l'API GitHub"
                        aria-label="Synchroniser les projets avec GitHub"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 4 23 10 17 10" />
                            <polyline points="1 20 1 14 7 14" />
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                        </svg>
                        {loading ? 'Synchro en cours…' : 'Rafraîchir'}
                    </button>
                </div>

                <h1 className="projects-page__title" id="projects-title">
                    Mes <span className="gradient-text">Projets &amp; Releases</span>
                </h1>
                <p className="projects-page__subtitle">
                    Catalogue dynamique synchronisé en temps réel sur mes deux comptes GitHub (
                    <a href="https://github.com/timotheegrollier" target="_blank" rel="noopener noreferrer" className="account-link">@timotheegrollier</a> et{' '}
                    <a href="https://github.com/stxtxm" target="_blank" rel="noopener noreferrer" className="account-link">@stxtxm</a>
                    ). Retrouvez notes de version, patch notes et téléchargements.
                </p>
            </header>

            {/* Controls Bar: Search, Account Switcher & Sort */}
            <div className="projects-controls">
                <div className="search-bar">
                    <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher par nom, tag, technologie, mot-clé…"
                        className="search-input"
                        aria-label="Rechercher un projet"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            className="search-clear-btn"
                            onClick={() => setSearchQuery('')}
                            aria-label="Effacer la recherche"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <div className="account-switcher">
                    <button
                        type="button"
                        className={`account-btn ${selectedAccount === 'all' ? 'account-btn--active' : ''}`}
                        onClick={() => setSelectedAccount('all')}
                    >
                        Tous ({projects.length})
                    </button>
                    <button
                        type="button"
                        className={`account-btn ${selectedAccount === 'timotheegrollier' ? 'account-btn--active' : ''}`}
                        onClick={() => setSelectedAccount('timotheegrollier')}
                    >
                        @timotheegrollier ({projects.filter((p) => p.owner === 'timotheegrollier').length})
                    </button>
                    <button
                        type="button"
                        className={`account-btn ${selectedAccount === 'stxtxm' ? 'account-btn--active' : ''}`}
                        onClick={() => setSelectedAccount('stxtxm')}
                    >
                        @stxtxm ({projects.filter((p) => p.owner === 'stxtxm').length})
                    </button>
                </div>

                <div className="sort-selector">
                    <label htmlFor="project-sort-select" className="sort-label">Trier :</label>
                    <select
                        id="project-sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="sort-dropdown"
                    >
                        <option value="updated">Récemment mis à jour</option>
                        <option value="stars">Étoiles GitHub (Popularité)</option>
                        <option value="name">Nom alphabétique</option>
                    </select>
                </div>
            </div>

            {/* Tag Filters */}
            <div className="projects-page__filters" id="project-filters">
                <button
                    className={`filter-tag ${selectedTag === 'All' ? 'filter-tag--active' : ''}`}
                    onClick={() => setSelectedTag('All')}
                    type="button"
                    aria-pressed={selectedTag === 'All'}
                >
                    Tous les tags
                </button>
                {popularTags.map((tag) => (
                    <button
                        key={tag}
                        className={`filter-tag ${selectedTag === tag ? 'filter-tag--active' : ''}`}
                        onClick={() => setSelectedTag(tag)}
                        type="button"
                        aria-pressed={selectedTag === tag}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Results count banner */}
            <div className="projects-summary-bar">
                <span>
                    {filteredProjects.length === 0
                        ? 'Aucun projet trouvé'
                        : `${filteredProjects.length} projet${filteredProjects.length > 1 ? 's' : ''} affiché${filteredProjects.length > 1 ? 's' : ''} sur ${projects.length} référencés`}
                </span>
                {(selectedTag !== 'All' || selectedAccount !== 'all' || searchQuery) && (
                    <button type="button" onClick={resetFilters} className="reset-filters-link">
                        Réinitialiser tous les filtres
                    </button>
                )}
            </div>

            {/* Projects Grid */}
            {filteredProjects.length > 0 ? (
                <div className="projects-page__grid" id="projects-grid">
                    {filteredProjects.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            index={index}
                            onSelect={setSelectedProject}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-projects">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                    <h3>Aucun projet ne correspond à vos filtres</h3>
                    <p>Essayez de modifier votre recherche ou de réinitialiser les tags.</p>
                    <button type="button" onClick={resetFilters} className="btn btn--primary">
                        Réinitialiser les filtres
                    </button>
                </div>
            )}

            {/* Modal */}
            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={closeModal}
                />
            )}
        </section>
    );
}
