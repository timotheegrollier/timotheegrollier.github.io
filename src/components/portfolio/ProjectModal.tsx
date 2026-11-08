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
}

type ModalTab = 'overview' | 'release' | 'links';

export function ProjectModal({ project, onClose }: ProjectModalProps) {
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
                {/* Mobile Drag Indicator */}
                <div className="project-modal__drag-handle" aria-hidden="true" />

                {/* Modal Header */}
                <header className="project-modal__header">
                    <div className="project-modal__header-left">
                        {/* Mini Project Avatar / Logo */}
                        <div className="project-modal__avatar">
                            <img
                                src={project.image}
                                alt={project.name}
                                className="project-modal__avatar-img"
                                loading="eager"
                                width={64}
                                height={64}
                            />
                        </div>

                        <div className="project-modal__title-group">
                            <div className="project-modal__meta-row">
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
                                {project.language && (
                                    <span className="modal-badge modal-badge--lang">
                                        <span
                                            className="lang-color"
                                            style={{ backgroundColor: getLanguageColor(project.language) }}
                                        />
                                        {project.language}
                                    </span>
                                )}
                                {Boolean(project.stars && project.stars > 0) && (
                                    <span className="modal-badge modal-badge--stars">
                                        ★ {project.stars}
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
                        </div>
                    </div>

                    <div className="project-modal__header-actions">
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="modal-header-btn modal-header-btn--live"
                                title="Ouvrir le projet en ligne"
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                                <span>Voir en ligne</span>
                            </a>
                        )}

                        <a
                            href={project.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="modal-header-btn modal-header-btn--github"
                            title="Consulter le code source sur GitHub"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                            </svg>
                            <span>Dépôt GitHub</span>
                        </a>

                        <button
                            className="project-modal__close"
                            onClick={onClose}
                            aria-label="Fermer la boîte de dialogue"
                            type="button"
                            ref={closeButtonRef}
                        >
                            <span aria-hidden="true">✕</span>
                        </button>
                    </div>
                </header>

                {/* Tabs Bar */}
                <div className="project-modal__tabs-bar">
                    <div className="project-modal__tabs" role="tablist">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'overview'}
                            className={`modal-tab-btn ${activeTab === 'overview' ? 'modal-tab-btn--active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="14" width="7" height="7" rx="1" />
                                <rect x="3" y="14" width="7" height="7" rx="1" />
                            </svg>
                            Présentation &amp; Architecture
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'release'}
                            className={`modal-tab-btn ${activeTab === 'release' ? 'modal-tab-btn--active' : ''}`}
                            onClick={() => setActiveTab('release')}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                <line x1="12" y1="22.08" x2="12" y2="12" />
                            </svg>
                            Releases &amp; Patch Notes
                            {hasRelease && <span className="tab-pill">{project.latestRelease?.version}</span>}
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'links'}
                            className={`modal-tab-btn ${activeTab === 'links' ? 'modal-tab-btn--active' : ''}`}
                            onClick={() => setActiveTab('links')}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                            Liens &amp; Dépôt
                        </button>
                    </div>
                </div>

                {/* Main Scrollable Body */}
                <div className="project-modal__body">
                    {/* Tab 1: Overview & Architecture */}
                    {activeTab === 'overview' && (
                        <div className="project-modal__tab-content animate-fade-in">
                            {/* Showcase Hero Banner Card */}
                            <div className="project-modal__showcase">
                                <div className="showcase-frame">
                                    <img
                                        src={project.image}
                                        alt={project.name}
                                        className="showcase-img"
                                        style={{
                                            objectFit: project.modalImageFit || 'contain',
                                            objectPosition: project.modalImagePosition || 'center',
                                        }}
                                        loading="eager"
                                        decoding="async"
                                    />
                                    <div className="showcase-glow" />
                                </div>
                            </div>

                            {/* Project Description Section */}
                            <section className="modal-card">
                                <h3 className="modal-card__heading">
                                    <span className="heading-icon">📋</span> À propos du projet
                                </h3>
                                <p className="modal-card__description">{project.description}</p>
                            </section>

                            {/* Highlights Grid */}
                            {project.highlights && project.highlights.length > 0 && (
                                <section className="modal-card">
                                    <h3 className="modal-card__heading">
                                        <span className="heading-icon">✨</span> Fonctionnalités &amp; Points Clés
                                    </h3>
                                    <div className="features-grid">
                                        {project.highlights.map((item, i) => (
                                            <div key={i} className="feature-item">
                                                <div className="feature-icon">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                </div>
                                                <span className="feature-text">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Architecture List */}
                            {project.architecture && project.architecture.length > 0 && (
                                <section className="modal-card">
                                    <h3 className="modal-card__heading">
                                        <span className="heading-icon">⚙️</span> Architecture &amp; Choix Techniques
                                    </h3>
                                    <div className="architecture-grid">
                                        {project.architecture.map((item, i) => (
                                            <div key={i} className="architecture-item">
                                                <div className="arch-bullet">⚡</div>
                                                <span className="arch-text">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Tech Stack */}
                            <section className="modal-card">
                                <h3 className="modal-card__heading">
                                    <span className="heading-icon">🏷️</span> Stack &amp; Technologies
                                </h3>
                                <div className="tech-tags-list">
                                    {project.tags.map((tag) => (
                                        <span key={tag} className="tech-tag">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {/* Tab 2: Release notes / Patchnotes */}
                    {activeTab === 'release' && (
                        <div className="project-modal__tab-content animate-fade-in">
                            {project.latestRelease ? (
                                <div className="release-section">
                                    {/* Release Hero Card */}
                                    <div className="release-banner">
                                        <div className="release-banner__left">
                                            <span className="release-tag-badge">
                                                {project.latestRelease.version}
                                            </span>
                                            <div>
                                                <h3 className="release-title">
                                                    {project.latestRelease.name}
                                                </h3>
                                                <span className="release-meta-date">
                                                    Publié le {formatFriendlyDate(project.latestRelease.publishedAt)}
                                                </span>
                                            </div>
                                        </div>

                                        <a
                                            href={project.latestRelease.htmlUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="release-gh-action"
                                        >
                                            GitHub Release &rarr;
                                        </a>
                                    </div>

                                    {/* Assets Download Grid */}
                                    {project.latestRelease.assets && project.latestRelease.assets.length > 0 && (
                                        <div className="modal-card">
                                            <h4 className="modal-card__heading">
                                                <span className="heading-icon">📦</span> Fichiers &amp; Binaires de Release ({project.latestRelease.assets.length})
                                            </h4>
                                            <div className="assets-download-grid">
                                                {project.latestRelease.assets.map((asset) => (
                                                    <a
                                                        key={asset.name}
                                                        href={asset.downloadUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="asset-btn"
                                                    >
                                                        <div className="asset-btn__icon">
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                                <polyline points="7 10 12 15 17 10" />
                                                                <line x1="12" y1="15" x2="12" y2="3" />
                                                            </svg>
                                                        </div>
                                                        <div className="asset-btn__details">
                                                            <span className="asset-name" title={asset.name}>{asset.name}</span>
                                                            <span className="asset-size">
                                                                {asset.size && asset.size > 0 ? formatBytes(asset.size) : 'Téléchargement direct'}
                                                            </span>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Release Markdown Content */}
                                    <div className="modal-card">
                                        <h4 className="modal-card__heading">
                                            <span className="heading-icon">📝</span> Changelog &amp; Notes de Version
                                        </h4>
                                        {project.latestRelease.body ? (
                                            <div className="release-markdown-wrapper">
                                                <MarkdownRenderer
                                                    content={project.latestRelease.body}
                                                    className="release-markdown"
                                                />
                                            </div>
                                        ) : (
                                            <p className="no-release-text">
                                                Aucun détail textuel fourni pour cette version sur GitHub.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="no-release-box">
                                    <div className="no-release-icon">
                                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="12" y1="8" x2="12" y2="12" />
                                            <line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                    </div>
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
                                        className="modal-header-btn modal-header-btn--github"
                                    >
                                        Consulter les commits sur GitHub &rarr;
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 3: Links & Clone command */}
                    {activeTab === 'links' && (
                        <div className="project-modal__tab-content animate-fade-in">
                            {/* Clone box */}
                            <section className="modal-card">
                                <h3 className="modal-card__heading">
                                    <span className="heading-icon">💻</span> Cloner le dépôt Git
                                </h3>
                                <div className="clone-terminal">
                                    <div className="clone-terminal__top">
                                        <div className="term-dots">
                                            <span className="dot dot--red" />
                                            <span className="dot dot--yellow" />
                                            <span className="dot dot--green" />
                                        </div>
                                        <span className="term-title">bash — clone repository</span>
                                    </div>
                                    <div className="clone-terminal__body">
                                        <span className="term-prompt">$</span>
                                        <code className="term-code">git clone {project.sourceUrl}.git</code>
                                        <button
                                            type="button"
                                            onClick={handleCopyClone}
                                            className={`clone-copy-btn ${copied ? 'clone-copy-btn--copied' : ''}`}
                                            title="Copier la commande de clonage"
                                        >
                                            {copied ? (
                                                <>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                    Copié !
                                                </>
                                            ) : (
                                                <>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                    </svg>
                                                    Copier
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </section>

                            {/* Direct access cards */}
                            <section className="modal-card">
                                <h3 className="modal-card__heading">
                                    <span className="heading-icon">🚀</span> Accès Direct &amp; Ressources
                                </h3>
                                <div className="links-cards-grid">
                                    <a
                                        href={project.sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="link-card-box"
                                    >
                                        <div className="link-card-box__icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                                            </svg>
                                        </div>
                                        <div className="link-card-box__content">
                                            <span className="link-card-box__title">Dépôt GitHub Officiel</span>
                                            <span className="link-card-box__sub">{project.sourceUrl}</span>
                                        </div>
                                        <span className="link-card-box__arrow">&rarr;</span>
                                    </a>

                                    {project.liveUrl && (
                                        <a
                                            href={project.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="link-card-box link-card-box--live"
                                        >
                                            <div className="link-card-box__icon">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <line x1="2" y1="12" x2="22" y2="12" />
                                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                                </svg>
                                            </div>
                                            <div className="link-card-box__content">
                                                <span className="link-card-box__title">Application en ligne</span>
                                                <span className="link-card-box__sub">{project.liveUrl}</span>
                                            </div>
                                            <span className="link-card-box__arrow">&rarr;</span>
                                        </a>
                                    )}

                                    {hasRelease && (
                                        <a
                                            href={`${project.sourceUrl}/releases`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="link-card-box"
                                        >
                                            <div className="link-card-box__icon">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                                                    <line x1="7" y1="7" x2="7.01" y2="7" />
                                                </svg>
                                            </div>
                                            <div className="link-card-box__content">
                                                <span className="link-card-box__title">Toutes les Releases &amp; Changelogs</span>
                                                <span className="link-card-box__sub">Consulter l'historique complet des versions</span>
                                            </div>
                                            <span className="link-card-box__arrow">&rarr;</span>
                                        </a>
                                    )}
                                </div>
                            </section>
                        </div>
                    )}
                </div>

                {/* Mobile Bottom Floating Action Bar */}
                <footer className="project-modal__mobile-actions">
                    <a
                        href={project.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modal-mobile-btn modal-mobile-btn--primary"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                        </svg>
                        Code source
                    </a>

                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="modal-mobile-btn modal-mobile-btn--secondary"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                            Voir en ligne
                        </a>
                    )}
                </footer>
            </div>
        </div>,
        document.body
    );
}
