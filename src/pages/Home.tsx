import { socialLinks } from '@/data/portfolio';
import { Link } from 'react-router-dom';
import './Home.scss';

const githubIcon = (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.111.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 0 1 6.004 0c2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z" />
    </svg>
);

const linkedinIcon = (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.55V9h3.569v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

export default function Home() {
    return (
        <section className="home-page" id="home">
            <div className="home-page__hero">
                <div className="home-page__content">
                    <div className="home-page__eyebrow">
                        <span className="home-page__status-dot" />
                        <span>En poste depuis 2023</span>
                        <span className="home-page__eyebrow-separator">/</span>
                        <span>Lyon · Bordeaux</span>
                    </div>

                    <p className="home-page__intro">Bonjour, moi c'est</p>
                    <h1 className="home-page__title">
                        Timothée<br />
                        <span className="gradient-text">Grollier.</span>
                    </h1>
                    <h2 className="home-page__role">Développeur Full-Stack <span>·</span> DevOps</h2>
                    <p className="home-page__desc">
                        Je conçois et fais évoluer des applications web de bout en bout :
                        interfaces <strong>React / TypeScript</strong>, backend <strong>Symfony</strong>,
                        jusqu'aux serveurs Linux et à l'automatisation du déploiement.
                    </p>

                    <div className="home-page__cta-group">
                        <Link to="/projets" className="home-page__button home-page__button--primary">
                            Mes projets
                            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                        </Link>
                        <a
                            href="/media/TimotheeGROLLIERCV.pdf"
                            className="home-page__button home-page__button--secondary"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Voir mon CV
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <path d="M14 2v6h6M8 13h8M8 17h5" />
                            </svg>
                        </a>
                    </div>

                    <div className="home-page__links">
                        <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
                            {githubIcon}<span>GitHub</span>
                        </a>
                        <a href="https://github.com/stxtxm" target="_blank" rel="noopener noreferrer">
                            {githubIcon}<span>stxtxm</span>
                        </a>
                        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                            {linkedinIcon}<span>LinkedIn</span>
                        </a>
                        <Link to="/contact">Me contacter <span aria-hidden="true">↗</span></Link>
                    </div>
                </div>

                <div className="home-page__visuals" aria-label="Portrait de Timothée Grollier">
                    <div className="home-page__photo-glow" />
                    <figure className="home-page__portrait-card">
                        <img
                            src="/media/timo.jpg"
                            alt="Portrait de Timothée Grollier"
                            className="home-page__profile-pic"
                            width={1200}
                            height={1600}
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                        />
                        <figcaption className="home-page__portrait-caption">
                            <span className="home-page__portrait-kicker">Du produit à l'infrastructure</span>
                            <strong>Concevoir. Construire. Déployer.</strong>
                        </figcaption>
                    </figure>
                </div>
            </div>

            <div className="home-page__expertise" aria-label="Domaines d'expertise">
                <div className="home-page__expertise-label">À travers toute la stack</div>
                <div className="home-page__expertise-item"><span>01</span><strong>Applications web</strong><small>React · TypeScript · Symfony</small></div>
                <div className="home-page__expertise-item"><span>02</span><strong>Infrastructure</strong><small>Linux · Docker · Proxmox</small></div>
                <div className="home-page__expertise-item"><span>03</span><strong>Exploration perso</strong><small>Audio/DSP · temps réel · IA</small></div>
            </div>
        </section>
    );
}
