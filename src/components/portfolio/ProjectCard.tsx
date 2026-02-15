import { Project } from '@/data/portfolio';
import './ProjectCard.scss';

interface ProjectCardProps {
    project: Project;
    onSelect: (project: Project) => void;
    index: number;
}

export function ProjectCard({ project, onSelect, index }: ProjectCardProps) {
    const openProject = () => onSelect(project);

    return (
        <article
            className={`project-card ${project.featured ? 'project-card--featured' : ''}`}
            style={{ animationDelay: `${index * 0.08}s` }}
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
        >
            <div className="project-card__image-wrapper">
                <img
                    src={project.image}
                    alt={project.name}
                    className="project-card__image"
                    loading="lazy"
                    decoding="async"
                    width={1280}
                    height={800}
                    sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
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
    );
}
