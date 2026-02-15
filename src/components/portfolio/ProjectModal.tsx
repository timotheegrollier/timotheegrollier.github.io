import { Project } from '@/data/portfolio';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useScrollLock } from '@/hooks/useScrollLock';
import './ProjectModal.scss';

interface ProjectModalProps {
    project: Project;
    onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const previousActiveElementRef = useRef<HTMLElement | null>(null);

    useScrollLock(true);

    useEffect(() => {
        previousActiveElementRef.current = document.activeElement as HTMLElement | null;
        closeButtonRef.current?.focus();

        const onEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        const trapFocus = (event: KeyboardEvent) => {
            if (event.key !== 'Tab' || !panelRef.current) return;

            const focusable = panelRef.current.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );

            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const active = document.activeElement;

            if (event.shiftKey && active === first) {
                event.preventDefault();
                last.focus();
                return;
            }

            if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            }
        };

        window.addEventListener('keydown', onEscape);
        window.addEventListener('keydown', trapFocus);

        return () => {
            window.removeEventListener('keydown', onEscape);
            window.removeEventListener('keydown', trapFocus);
            previousActiveElementRef.current?.focus();
        };
    }, [onClose]);

    if (typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <div
            className="project-modal"
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
            id="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            aria-describedby="project-modal-desc"
        >
            <div className="project-modal__panel" ref={panelRef}>
                <button
                    className="project-modal__close"
                    onClick={onClose}
                    aria-label="Fermer"
                    type="button"
                    ref={closeButtonRef}
                >
                    <span aria-hidden="true">✕</span>
                </button>

                <div className="project-modal__media">
                    <img
                        src={project.image}
                        alt={project.name}
                        className="project-modal__image"
                        style={{
                            objectFit: project.modalImageFit,
                            objectPosition: project.modalImagePosition,
                        }}
                        width={1280}
                        height={800}
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                    />
                </div>

                <div className="project-modal__content">
                    <div className="project-modal__handle" aria-hidden="true" />
                    <h2 className="project-modal__title" id="project-modal-title">
                        {project.name}
                    </h2>
                    <p className="project-modal__desc" id="project-modal-desc">
                        {project.description}
                    </p>

                    <div className="project-modal__tags">
                        {project.tags.map((tag) => (
                            <span key={tag} className="project-modal__tag">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="project-modal__actions">
                        <a
                            href={project.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-modal__btn project-modal__btn--primary"
                        >
                            Code source
                        </a>
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-modal__btn project-modal__btn--secondary"
                            >
                                Voir en ligne
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}
