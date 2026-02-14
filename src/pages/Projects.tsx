import { useState, useMemo } from 'react';
import { projects, type Project } from '@/data/portfolio';
import './Projects.scss';

// Extract unique tags
const allTags = Array.from(new Set(projects.flatMap((p) => p.tags))).sort();

export default function Projects() {
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const filtered = useMemo(() => {
        if (!activeTag) return projects;
        return projects.filter((p) => p.tags.includes(activeTag));
    }, [activeTag]);

    return (
        <section className="projects-page" id="projects">
            <header className="projects-page__header">
                <h1 className="projects-page__title" id="projects-title">
                    Mes <span className="gradient-text">Projets</span>
                </h1>
                <p className="projects-page__subtitle">
                    Une sélection de réalisations qui reflètent ma passion et mon évolution.
                </p>
            </header>

            {/* Filters */}
            <div className="projects-page__filters" id="project-filters">
                <button
                    className={`filter-tag ${!activeTag ? 'filter-tag--active' : ''}`}
                    onClick={() => setActiveTag(null)}
                >
                    Tous
                </button>
                {allTags.map((tag) => (
                    <button
                        key={tag}
                        className={`filter-tag ${activeTag === tag ? 'filter-tag--active' : ''}`}
                        onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Projects grid */}
            <div className="projects-page__grid" id="projects-grid">
                {filtered.map((project, index) => (
                    <article
                        key={project.id}
                        className={`project-card ${project.featured ? 'project-card--featured' : ''}`}
                        style={{ animationDelay: `${index * 0.08}s` }}
                        onClick={() => setSelectedProject(project)}
                        id={`project-${project.id}`}
                    >
                        <div className="project-card__image-wrapper">
                            <img
                                src={project.image}
                                alt={project.name}
                                className="project-card__image"
                                loading="lazy"
                            />
                            <div className="project-card__overlay">
                                <span>Voir détails</span>
                            </div>
                        </div>

                        <div className="project-card__content">
                            <h3 className="project-card__name">{project.name}</h3>
                            <p className="project-card__desc">{project.description}</p>
                            <div className="project-card__tags">
                                {project.tags.slice(0, 3).map((tag) => (
                                    <span key={tag} className="project-card__tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* Modal */}
            {selectedProject && (
                <div
                    className="project-modal"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setSelectedProject(null);
                    }}
                    id="project-modal"
                >
                    <div className="project-modal__content">
                        <button
                            className="project-modal__close"
                            onClick={() => setSelectedProject(null)}
                            aria-label="Fermer"
                            id="modal-close"
                        >
                            ✕
                        </button>

                        <img
                            src={selectedProject.image}
                            alt={selectedProject.name}
                            className="project-modal__image"
                        />

                        <div className="project-modal__body">
                            <h2 className="project-modal__title">{selectedProject.name}</h2>
                            <p className="project-modal__desc">{selectedProject.description}</p>

                            <div className="project-modal__tags">
                                {selectedProject.tags.map((tag) => (
                                    <span key={tag} className="project-modal__tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="project-modal__actions">
                                <a
                                    href={selectedProject.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="project-modal__btn project-modal__btn--primary"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                    Code source
                                </a>
                                {selectedProject.liveUrl && (
                                    <a
                                        href={selectedProject.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="project-modal__btn project-modal__btn--secondary"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M6 3h7v7M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Voir en ligne
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
