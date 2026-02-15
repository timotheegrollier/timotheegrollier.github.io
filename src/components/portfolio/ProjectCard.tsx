import { Project } from '@/data/portfolio';
import './ProjectCard.scss';

interface ProjectCardProps {
    project: Project;
    onSelect: (project: Project) => void;
    index: number;
}

export function ProjectCard({ project, onSelect, index }: ProjectCardProps) {
    return (
        <article
            className={`project-card ${project.featured ? 'project-card--featured' : ''}`}
            style={{ animationDelay: `${index * 0.08}s` }}
            onClick={() => onSelect(project)}
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
    );
}
