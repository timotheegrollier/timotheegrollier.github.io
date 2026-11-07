import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Project } from '@/data/portfolio';
import { useScrollLock } from '@/hooks/useScrollLock';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';
import { formatFriendlyDate, formatBytes, getLanguageColor } from '@/utils/formatters';
import './ProjectModal.scss';

interface ProjectModalProps {
    project: Project;
    onClose: () => void;
    onDelete?: (project: Project) => void;
}

type ModalTab = 'overview' | 'release' | 'links';

export function ProjectModal({ project, onClose, onDelete }: ProjectModalProps) {
    const [activeTab, setActiveTab] = useState<ModalTab>('overview');
    const [copied, setCopied] = useState(false);
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

    const handleCopyClone = () => {
        navigator.clipboard.writeText(`git clone ${project.sourceUrl}.git`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (typeof document === 'undefined') {
        return null;
    }

    const hasRelease = Boolean(project.latestRelease);

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
        >
            <div className="project-modal__panel" ref={panelRef}>
                <button
                    className="project-modal__close"
                    onClick={onClose}
                    aria-label="Fermer la boîte de dialogue"
                    type="button"
                    ref={closeButtonRef}
                >
                    <span aria-hidden="true">✕</span>
                </button>

                {/* Left Side: Media Hero */}
                <div className="project-modal__media">
                    <img
                        src={project.image}
                        alt={project.name}
                        className="project-modal__image"
                        style={{
                            objectFit: project.modalImageFit || 'contain',
                            objectPosition: project.modalImagePosition || 'center top',
                        }}
                        width={1280}
                        height={800}
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                    />
                    <div className="project-modal__media-backdrop" />
                </div>

                {/* Right Side: Content Panel */}
                <div className="project-modal__content">
                    <div className="project-modal__handle" aria-hidden="true" />

                    {/* Header info */}
                    <header className="project-modal__header">
                        <div className="project-modal__badges">
                            {project.owner && (
                                <span className={`modal-badge modal-badge--${project.owner}`}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                                    </svg>
                                    @{project.owner}
                                </span>
                            )}
                            {project.latestRelease && (
                                <span className="modal-badge modal-badge--release">
                                    <span className="dot" />
                                    {project.latestRelease.version}
                                </span>
                            )}
                            {Boolean(project.stars && project.stars > 0) && (
                                <span className="modal-badge modal-badge--stars">
                                    ★ {project.stars}
                                </span>
                            )}
                            {project.language && (
                                <span className="modal-badge modal-badge--lang">
                                    <span
                                        className="lang-color"
                                        style={{ backgroundColor: getLanguageColor(project.language) }}
                                    />
                                    {project.language}
                                </span>
                            )}
                        </div>

                        <h2 className="project-modal__title" id="project-modal-title">
                            {project.name}
                        </h2>

                        {project.updatedAt && (
                            <p className="project-modal__date">
                                Dernière activité : {formatFriendlyDate(project.updatedAt)}
                            </p>
                        )}
                    </header>

                    {/* Navigation Tabs */}
                    <div className="project-modal__tabs" role="tablist">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'overview'}
                            className={`modal-tab-btn ${activeTab === 'overview' ? 'modal-tab-btn--active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Présentation &amp; Architecture
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'release'}
                            className={`modal-tab-btn ${activeTab === 'release' ? 'modal-tab-btn--active' : ''}`}
                            onClick={() => setActiveTab('release')}
                        >
                            Patch notes &amp; Releases
                            {hasRelease && <span className="tab-pill">{project.latestRelease?.version}</span>}
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'links'}
                            className={`modal-tab-btn ${activeTab === 'links' ? 'modal-tab-btn--active' : ''}`}
                            onClick={() => setActiveTab('links')}
                        >
                            Liens &amp; Dépôt
                        </button>
                    </div>

                    {/* Tab 1: Overview & Architecture */}
                    {activeTab === 'overview' && (
                        <div className="project-modal__tab-body">
                            <section className="modal-section">
                                <h3 className="modal-section__title">Description</h3>
                                <p className="project-modal__desc">{project.description}</p>
                            </section>

                            {project.highlights && project.highlights.length > 0 && (
                                <section className="modal-section">
                                    <h3 className="modal-section__title">Fonctionnalités clés</h3>
                                    <ul className="modal-highlights">
                                        {project.highlights.map((item, i) => (
                                            <li key={i} className="modal-highlight-item">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {project.architecture && project.architecture.length > 0 && (
                                <section className="modal-section">
                                    <h3 className="modal-section__title">Architecture &amp; Choix techniques</h3>
                                    <ul className="modal-architecture-list">
                                        {project.architecture.map((item, i) => (
                                            <li key={i} className="modal-architecture-item">
                                                <span className="bullet">⚡</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            <section className="modal-section">
                                <h3 className="modal-section__title">Technologies</h3>
                                <div className="project-modal__tags">
                                    {project.tags.map((tag) => (
                                        <span key={tag} className="project-modal__tag">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {/* Tab 2: Release notes / Patchnotes */}
                    {activeTab === 'release' && (
                        <div className="project-modal__tab-body">
                            {project.latestRelease ? (
                                <div className="release-view">
                                    <div className="release-card-header">
                                        <div className="release-card-header__info">
                                            <span className="release-tag-pill">
                                                {project.latestRelease.version}
                                            </span>
                                            <h3 className="release-card-header__title">
                                                {project.latestRelease.name}
                                            </h3>
                                        </div>
                                        <span className="release-date">
                                            {formatFriendlyDate(project.latestRelease.publishedAt)}
                                        </span>
                                    </div>

                                    {/* Assets download section */}
                                    {project.latestRelease.assets && project.latestRelease.assets.length > 0 && (
                                        <div className="release-assets">
                                            <h4 className="release-assets__title">Fichiers &amp; Binaires de release</h4>
                                            <div className="release-assets__grid">
                                                {project.latestRelease.assets.map((asset) => (
                                                    <a
                                                        key={asset.name}
                                                        href={asset.downloadUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="asset-download-btn"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                            <polyline points="7 10 12 15 17 10" />
                                                            <line x1="12" y1="15" x2="12" y2="3" />
                                                        </svg>
                                                        <div className="asset-info">
                                                            <span className="asset-name">{asset.name}</span>
                                                            {Boolean(asset.size && asset.size > 0) && (
                                                                <span className="asset-size">({formatBytes(asset.size)})</span>
                                                            )}
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Markdown Patch notes body */}
                                    <div className="release-body-wrapper">
                                        <h4 className="release-body-title">Détail du Changelog</h4>
                                        {project.latestRelease.body ? (
                                            <MarkdownRenderer
                                                content={project.latestRelease.body}
                                                className="release-markdown"
                                            />
                                        ) : (
                                            <p className="no-release-text">
                                                Aucune description textuelle pour cette version.
                                            </p>
                                        )}
                                    </div>

                                    <div className="release-footer">
                                        <a
                                            href={project.latestRelease.htmlUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="release-github-link"
                                        >
                                            Voir la release sur GitHub &rarr;
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="no-release-placeholder">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    <h4>Aucune release taggée pour le moment</h4>
                                    <p>
                                        Ce projet évolue en continu via la branche principale.
                                        Vous pouvez consulter l’historique des commits et les pull requests
                                        directement sur GitHub.
                                    </p>
                                    <a
                                        href={`${project.sourceUrl}/commits`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="project-modal__btn project-modal__btn--secondary"
                                    >
                                        Historique des commits sur GitHub
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 3: Links & Clone command */}
                    {activeTab === 'links' && (
                        <div className="project-modal__tab-body">
                            <section className="modal-section">
                                <h3 className="modal-section__title">Cloner le projet</h3>
                                <div className="clone-box">
                                    <code>git clone {project.sourceUrl}.git</code>
                                    <button
                                        type="button"
                                        onClick={handleCopyClone}
                                        className="clone-copy-btn"
                                        title="Copier la commande"
                                    >
                                        {copied ? '✓ Copié' : 'Copier'}
                                    </button>
                                </div>
                            </section>

                            <section className="modal-section">
                                <h3 className="modal-section__title">Accès direct</h3>
                                <div className="modal-links-grid">
                                    <a
                                        href={project.sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="link-card"
                                    >
                                        <div className="link-card__icon">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                                            </svg>
                                        </div>
                                        <div className="link-card__text">
                                            <span className="link-card__label">Dépôt GitHub</span>
                                            <span className="link-card__url">{project.sourceUrl}</span>
                                        </div>
                                    </a>

                                    {project.liveUrl && (
                                        <a
                                            href={project.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="link-card link-card--live"
                                        >
                                            <div className="link-card__icon">
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <line x1="2" y1="12" x2="22" y2="12" />
                                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                                </svg>
                                            </div>
                                            <div className="link-card__text">
                                                <span className="link-card__label">Application en ligne</span>
                                                <span className="link-card__url">{project.liveUrl}</span>
                                            </div>
                                        </a>
                                    )}

                                    {hasRelease && (
                                        <a
                                            href={`${project.sourceUrl}/releases`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="link-card"
                                        >
                                            <div className="link-card__icon">
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                                                    <line x1="7" y1="7" x2="7.01" y2="7" />
                                                </svg>
                                            </div>
                                            <div className="link-card__text">
                                                <span className="link-card__label">Toutes les releases</span>
                                                <span className="link-card__url">Historique complet sur GitHub</span>
                                            </div>
                                        </a>
                                    )}
                                </div>
                            </section>
                        </div>
                    )}

                    {/* Bottom action bar */}
                    <footer className="project-modal__actions">
                        <a
                            href={project.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-modal__btn project-modal__btn--primary"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                            </svg>
                            Code source GitHub
                        </a>

                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-modal__btn project-modal__btn--secondary"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                                Voir en ligne
                            </a>
                        )}

                        {onDelete && (
                            <button
                                type="button"
                                className="project-modal__btn project-modal__btn--danger"
                                onClick={() => {
                                    onDelete(project);
                                    onClose();
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    <line x1="10" y1="11" x2="10" y2="17" />
                                    <line x1="14" y1="11" x2="14" y2="17" />
                                </svg>
                                Supprimer de la sélection
                            </button>
                        )}
                    </footer>
                </div>
            </div>
        </div>,
        document.body
    );
}
