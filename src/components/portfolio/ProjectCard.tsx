import type { MouseEvent } from 'react';
import type { Project } from '@/data/portfolio';
import { formatRelativeTime, getLanguageColor } from '@/utils/formatters';
import './ProjectCard.scss';

interface ProjectCardProps {
    project: Project;
    onSelect: (project: Project) => void;
    index: number;
    onDelete?: (project: Project) => void;
}

export function ProjectCard({ project, onSelect, index, onDelete }: ProjectCardProps) {
    const openProject = () => onSelect(project);

    const handleExternalClick = (e: MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <article
            className={`project-card ${project.featured ? 'project-card--featured' : ''}`}
            style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
            onClick={openProject}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openProject();
                }
            }}
            role="button"
            tabIndex={0}
            id={`project-${project.id}`}
            aria-label={`Voir les détails du projet ${project.name}`}
        >
            <div className="project-card__image-wrapper">
                <img
                    src={project.image}
                    alt={project.name}
                    className="project-card__image"
                    style={{
                        objectFit: project.cardImageFit || 'cover',
                        objectPosition: project.cardImagePosition || 'center',
                    }}
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={500}
                />

                {/* Overlays & Badges */}
                <div className="project-card__badges">
                    {project.owner && (
                        <span className={`project-card__badge project-card__badge--owner project-card__badge--${project.owner}`}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                            </svg>
                            @{project.owner}
                        </span>
                    )}

                    {project.latestRelease && (
                        <span className="project-card__badge project-card__badge--release" title={`Dernière release : ${project.latestRelease.name}`}>
                            <span className="release-pulse" />
                            {project.latestRelease.version}
                        </span>
                    )}

                    {Boolean(project.stars && project.stars > 0) && (
                        <span className="project-card__badge project-card__badge--stars">
                            ★ {project.stars}
                        </span>
                    )}

                    {onDelete && (
                        <button
                            type="button"
                            className="project-card__badge project-card__badge--delete"
                            title="Supprimer ce projet de la sélection"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(project);
                            }}
                            aria-label={`Supprimer ${project.name}`}
                        >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                            Supprimer
                        </button>
                    )}
                </div>

                <div className="project-card__overlay">
                    <span className="project-card__view-action">
                        Consulter les détails &amp; notes
                    </span>
                </div>
            </div>

            <div className="project-card__content">
                <div className="project-card__meta">
                    {project.language && (
                        <div className="project-card__lang">
                            <span
                                className="lang-dot"
                                style={{ backgroundColor: getLanguageColor(project.language) }}
                            />
                            <span>{project.language}</span>
                        </div>
                    )}
                    {project.updatedAt && (
                        <span className="project-card__time">
                            {formatRelativeTime(project.updatedAt)}
                        </span>
                    )}
                </div>

                <h3 className="project-card__name">{project.name}</h3>
                <p className="project-card__desc">{project.description}</p>

                <div className="project-card__tags">
                    {project.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="project-card__tag">
                            {tag}
                        </span>
                    ))}
                    {project.tags.length > 4 && (
                        <span className="project-card__tag project-card__tag--more">
                            +{project.tags.length - 4}
                        </span>
                    )}
                </div>

                <div className="project-card__footer">
                    <button
                        type="button"
                        className="project-card__cta"
                        onClick={(e) => {
                            e.stopPropagation();
                            openProject();
                        }}
                    >
                        Notes &amp; Patch
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>

                    <div className="project-card__quick-links">
                        {project.sourceUrl && (
                            <a
                                href={project.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="quick-link"
                                title="Voir le code source GitHub"
                                onClick={handleExternalClick}
                                aria-label="Code source GitHub"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                                </svg>
                            </a>
                        )}

                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="quick-link quick-link--live"
                                title="Ouvrir le site en ligne"
                                onClick={handleExternalClick}
                                aria-label="Site en ligne"
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}
