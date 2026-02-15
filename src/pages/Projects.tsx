import { useState, useMemo } from 'react';
import { projects, type Project } from '@/data/portfolio';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { ProjectModal } from '@/components/portfolio/ProjectModal';
import './Projects.scss';

// Extract unique tags
const allTags = Array.from(new Set(projects.flatMap((p) => p.tags))).sort();

export default function Projects() {
    const [selectedTag, setSelectedTag] = useState<string>('All');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const filtered = useMemo(() => {
        if (selectedTag === 'All') return projects;
        return projects.filter((p) => p.tags.includes(selectedTag));
    }, [selectedTag]);

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
                    className={`filter-tag ${selectedTag === 'All' ? 'filter-tag--active' : ''}`}
                    onClick={() => setSelectedTag('All')}
                >
                    Tous
                </button>
                {allTags.map((tag) => (
                    <button
                        key={tag}
                        className={`filter-tag ${selectedTag === tag ? 'filter-tag--active' : ''}`}
                        onClick={() => setSelectedTag(tag)}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Projects grid */}
            <div className="projects-page__grid" id="projects-grid">
                {filtered.map((project, index) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                        onSelect={setSelectedProject}
                    />
                ))}
            </div>

            {/* Modal */}
            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </section>
    );
}
