import { Link } from 'react-router-dom';
import { socialLinks } from '@/data/portfolio';
import './Home.scss';

export default function Home() {
    return (
        <section className="home-page" id="home">
            <div className="home-page__content">
                <div className="home-page__profile-wrapper">
                    <img src="/timo.jpg" alt="Timothée Grollier" className="home-page__profile-pic" />
                    <div className="home-page__status">
                        <span className="status-dot"></span>
                        Disponible pour missions freelance & CDI
                    </div>
                </div>

                <h1 className="home-page__title">
                    Timothée <br />
                    <span className="gradient-text">Grollier</span>
                </h1>

                <h2 className="home-page__role">
                    Lead Développeur Full-Stack <span className="highlight">& DevOps</span>
                </h2>

                <p className="home-page__desc">
                    Expert en écosystèmes <strong>Symfony</strong> & <strong>React</strong>.
                    Je conçois des architectures robustes, modernes et scalables.
                    Passionné par l'Open Source, <strong>Linux</strong> et l'innovation par l'IA.
                </p>

                <div className="home-page__cta-group">
                    <Link to="/projets" className="btn btn--primary" id="home-projects-btn">
                        Voir mes projets
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </Link>
                    <a href="/media/TimotheeGROLLIERCV.pdf" download className="btn btn--outline" id="home-cv-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Télécharger CV
                    </a>
                </div>

                <div className="home-page__socials">
                    <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" title="GitHub">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                    </a>
                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                    </a>
                    <a href={`mailto:${socialLinks.email}`} title="Email">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </a>
                </div>
            </div>

            <div className="home-page__visuals">
                <div className="code-block">
                    <div className="code-header">
                        <div className="window-controls">
                            <span className="dot red"></span>
                            <span className="dot yellow"></span>
                            <span className="dot green"></span>
                        </div>
                        <span className="filename">developer.ts</span>
                    </div>
                    <div className="code-content">
                        <div className="line-numbers">
                            <span>1</span>
                            <span>2</span>
                            <span>3</span>
                            <span>4</span>
                            <span>5</span>
                            <span>6</span>
                            <span>7</span>
                        </div>
                        <pre>
                            <code>
                                <span className="k">const</span> <span className="v">developer</span> = &#123;
                                <span className="p">name</span>: <span className="s">"Timothée"</span>,
                                <span className="p">role</span>: <span className="s">"Lead Tech"</span>,
                                <span className="p">skills</span>: [
                                <span className="s">"Symfony"</span>, <span className="s">"React"</span>,
                                <span className="s">"Docker"</span>, <span className="s">"TDD"</span>
                                ],
                                <span className="p">os</span>: <span className="s">"Debian"</span>
                                &#125;;<span className="cursor">|</span></code>
                        </pre>
                    </div>
                </div>
                <div className="visual-orb"></div>
            </div>
        </section>
    );
}
