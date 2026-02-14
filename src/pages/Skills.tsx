import { useEffect, useRef } from 'react';
import { skills, experiences, type Skill } from '@/data/portfolio';
import './Skills.scss';

function SkillBar({ skill, index }: { skill: Skill; index: number }) {
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && barRef.current) {
                    barRef.current.style.width = `${skill.level}%`;
                }
            },
            { threshold: 0.3 }
        );

        if (barRef.current?.parentElement) {
            observer.observe(barRef.current.parentElement);
        }

        return () => observer.disconnect();
    }, [skill.level]);

    return (
        <div
            className="skill-bar"
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            <div className="skill-bar__header">
                <span className="skill-bar__name">{skill.name}</span>
                <span className="skill-bar__level">{skill.level}%</span>
            </div>
            <div className="skill-bar__track">
                <div
                    ref={barRef}
                    className="skill-bar__fill"
                    style={{ width: 0, transitionDelay: `${index * 0.05}s` }}
                />
            </div>
        </div>
    );
}

export default function Skills() {
    const languages = skills.filter((s) => s.category === 'language');
    const frameworks = skills.filter((s) => s.category === 'framework');
    const tools = skills.filter((s) => s.category === 'tool');

    return (
        <section className="skills-page" id="skills">
            <header className="skills-page__header">
                <h1 className="skills-page__title" id="skills-title">
                    Mes <span className="gradient-text">Compétences</span>
                </h1>
                <p className="skills-page__subtitle">
                    En constante évolution — j'apprends et je progresse chaque jour.
                </p>
            </header>

            <div className="skills-page__grid">
                {/* Languages */}
                <div className="skill-category" id="skills-languages">
                    <div className="skill-category__header">
                        <span className="skill-category__icon">💻</span>
                        <h2 className="skill-category__title">Langages</h2>
                    </div>
                    <div className="skill-category__list">
                        {languages.map((skill, i) => (
                            <SkillBar key={skill.name} skill={skill} index={i} />
                        ))}
                    </div>
                </div>

                {/* Frameworks */}
                <div className="skill-category" id="skills-frameworks">
                    <div className="skill-category__header">
                        <span className="skill-category__icon">⚙️</span>
                        <h2 className="skill-category__title">Frameworks & Outils</h2>
                    </div>
                    <div className="skill-category__list">
                        {frameworks.map((skill, i) => (
                            <SkillBar key={skill.name} skill={skill} index={i} />
                        ))}
                    </div>
                </div>

                {/* Tools */}
                <div className="skill-category" id="skills-tools">
                    <div className="skill-category__header">
                        <span className="skill-category__icon">🛠️</span>
                        <h2 className="skill-category__title">Outils & Environnement</h2>
                    </div>
                    <div className="skill-category__list">
                        {tools.map((skill, i) => (
                            <SkillBar key={skill.name} skill={skill} index={i} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Experience */}
            <div className="skills-page__experience" id="experience-section">
                <h2 className="skills-page__section-title">
                    <span className="gradient-text">Expérience</span>
                </h2>

                <div className="timeline">
                    {experiences.map((exp) => (
                        <article key={exp.id} className="timeline__item">
                            <div className="timeline__dot" />
                            <div className="timeline__content">
                                <span className="timeline__period">{exp.period}</span>
                                <h3 className="timeline__title">{exp.title}</h3>
                                <h4 className="timeline__company">{exp.company}</h4>
                                <ul className="timeline__tasks">
                                    {exp.tasks.map((task, i) => (
                                        <li key={i}>{task}</li>
                                    ))}
                                </ul>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Other skills */}
                <div className="skills-page__extras">
                    <div className="extra-card">
                        <span className="extra-card__icon">🌍</span>
                        <h4>Anglais courant</h4>
                        <p>Lecture de documentation, communication technique</p>
                    </div>
                    <div className="extra-card">
                        <span className="extra-card__icon">📐</span>
                        <h4>Méthodes Agiles</h4>
                        <p>Scrum, Kanban, travail en équipe</p>
                    </div>
                    <div className="extra-card">
                        <span className="extra-card__icon">🎨</span>
                        <h4>UI/UX Design</h4>
                        <p>Sens du design, responsive, accessibilité</p>
                    </div>
                </div>
            </div>

            {/* Interests */}
            <div className="skills-page__interests" id="interests-section">
                <h2 className="skills-page__section-title">
                    <span className="gradient-text">Centres d'intérêt</span>
                </h2>
                <div className="interests-grid">
                    <div className="interest-item">
                        <span className="interest-item__icon">🎸</span>
                        <span className="interest-item__label">Guitare / M.A.O</span>
                    </div>
                    <div className="interest-item">
                        <span className="interest-item__icon">🏄</span>
                        <span className="interest-item__label">Bodyboard</span>
                    </div>
                    <div className="interest-item">
                        <span className="interest-item__icon">🎮</span>
                        <span className="interest-item__label">Jeux vidéo</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
