import { socialLinks } from '@/data/portfolio';
import { TerminalBlock } from '@/components/home/TerminalBlock';
import './Home.scss';

export default function Home() {
    return (
        <section className="home-page" id="home">
            <div className="home-page__content">
                <div className="home-page__profile-wrapper">
                    <img src="/media/timo.jpg" alt="Timothée Grollier" className="home-page__profile-pic" />
                    <div className="home-page__status">
                        <span className="status-dot"></span>
                        En CDI • À l'écoute d'opportunités/missions
                    </div>
                </div>

                <h2 className="home-page__role">
                    Lead Développeur <span className="highlight">Full-Stack & DevOps</span>
                </h2>
                <h1 className="home-page__title">
                    Créons des expériences <br />
                    <span className="gradient-text">Web Uniques</span>
                </h1>
                <p className="home-page__desc">
                    Passionné par l'architecture logicielle propre, la performance et l'expérience utilisateur.
                    Je transforme des problèmes complexes en solutions <strong>élégantes et scalables</strong>.
                </p>

                <div className="home-page__cta-group">
                    <a href="#projects" className="btn btn--primary">
                        Voir mes projets
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </a>
                    <a href="#contact" className="btn btn--outline">
                        Me contacter
                    </a>
                </div>

                <div className="home-page__socials">
                    <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                    </a>
                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                    </a>
                    <a href={`mailto:${socialLinks.email}`} aria-label="Email">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-11.179l4.623 5.467zm-4.488-6.353h21.729l-10.863 11.136-10.866-11.136zm19.015 6.36l4.85 5.707v-11.179l-4.85 5.472zm-7.662 4.42l-2.653 2.72-2.748-2.816-5.857 7.739h17.203l-5.945-7.643z" />
                        </svg>
                    </a>
                </div>
            </div>

            <div className="home-page__visuals">
                <TerminalBlock />
                <div className="visual-orb"></div>
            </div>
        </section>
    );
}
