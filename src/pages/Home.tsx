import { Link } from 'react-router-dom';
import { socialLinks } from '@/data/portfolio';
import './Home.scss';

export default function Home() {
    return (
        <section className="hero" id="hero">
            <div className="hero__content">
                <div className="hero__badge">
                    <span className="hero__badge-dot" />
                    Disponible pour de nouvelles opportunités
                </div>

                <h1 className="hero__title" id="hero-title">
                    Timothée
                    <br />
                    <span className="hero__title-gradient">Grollier</span>
                </h1>

                <h2 className="hero__subtitle" id="hero-subtitle">
                    Développeur Full-Stack
                </h2>

                <p className="hero__description">
                    Passionné par le développement web, je crée des applications modernes
                    et performantes. De React à Symfony, je maîtrise l'ensemble de la
                    stack pour donner vie à vos projets.
                </p>

                <div className="hero__actions">
                    <Link to="/projets" className="hero__cta hero__cta--primary" id="cta-projects">
                        <span>Voir mes projets</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                    <a
                        href="/media/TimotheeGROLLIERCV.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hero__cta hero__cta--secondary"
                        id="cta-cv"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 2v8M4 7l4 4 4-4M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Télécharger CV</span>
                    </a>
                </div>

                <div className="hero__social">
                    <a
                        href={socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hero__social-link"
                        aria-label="GitHub"
                        id="social-github"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                    </a>
                    <a
                        href={socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hero__social-link"
                        aria-label="LinkedIn"
                        id="social-linkedin"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Animated decorative elements */}
            <div className="hero__decoration" aria-hidden="true">
                <div className="hero__orb hero__orb--1" />
                <div className="hero__orb hero__orb--2" />
                <div className="hero__orb hero__orb--3" />
                <div className="hero__grid" />
            </div>
        </section>
    );
}
