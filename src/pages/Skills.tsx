import { useMemo } from 'react';
import {
    skillGroups,
    experiences,
    interests,
    type Skill,
    type SkillContext,
    type SkillTier,
} from '@/data/portfolio';
import './Skills.scss';

const TIER_LABEL: Record<SkillTier, string> = {
    daily: 'Au quotidien',
    solid: 'Maîtrisé',
    exploring: 'En exploration',
};

const CONTEXT_LABEL: Record<SkillContext, string> = {
    pro: 'Pro',
    perso: 'Perso',
    both: 'Pro & perso',
};

function SkillRow({ skill }: { skill: Skill }) {
    return (
        <li className="skill-item">
            <span className="skill-item__name">{skill.name}</span>
            <span className="skill-item__meta">
                <span className="skill-tag skill-tag--context">{CONTEXT_LABEL[skill.context]}</span>
                <span className={`skill-tag skill-tag--tier skill-tag--${skill.tier}`}>
                    {TIER_LABEL[skill.tier]}
                </span>
            </span>
        </li>
    );
}

export default function Skills() {
    const focus = useMemo(
        () =>
            skillGroups.flatMap((group) =>
                group.skills
                    .filter((s) => s.tier === 'exploring')
                    .map((s) => ({ skill: s, group: group.title }))
            ),
        []
    );

    return (
        <section className="skills-page" id="skills">
            <header className="skills-page__header">
                <h1 className="skills-page__title">
                    Mes <span className="gradient-text">Compétences</span>
                </h1>
                <p className="skills-page__subtitle">
                    Développeur full-stack en poste depuis 2023, avec un labo perso autour de l'audio,
                    de l'IA et du temps réel. Plutôt que des pourcentages, voici où et comment
                    j'utilise chaque technologie.
                </p>
                <ul className="skills-legend" aria-label="Légende">
                    <li><span className="skill-tag skill-tag--tier skill-tag--daily">Au quotidien</span> utilisé régulièrement</li>
                    <li><span className="skill-tag skill-tag--tier skill-tag--solid">Maîtrisé</span> mis en œuvre sur des projets réels</li>
                    <li><span className="skill-tag skill-tag--tier skill-tag--exploring">En exploration</span> en apprentissage actif</li>
                </ul>
            </header>

            {focus.length > 0 && (
                <div className="skills-focus">
                    <h2 className="skills-page__section-title">
                        Ce que je creuse <span className="gradient-text">en ce moment</span>
                    </h2>
                    <ul className="skills-focus__list">
                        {focus.map(({ skill, group }) => (
                            <li key={skill.name} className="skills-focus__item">
                                <span className="skills-focus__name">{skill.name}</span>
                                <span className="skills-focus__group">{group}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="skills-page__grid">
                {skillGroups.map((group) => (
                    <div key={group.id} className="skill-category">
                        <div className="skill-category__header">
                            <span className="skill-category__icon">{group.icon}</span>
                            <h2 className="skill-category__title">{group.title}</h2>
                        </div>
                        <p className="skill-category__summary">{group.summary}</p>
                        <ul className="skill-category__list">
                            {group.skills.map((skill) => (
                                <SkillRow key={skill.name} skill={skill} />
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Experience */}
            <div className="skills-page__experience">
                <h2 className="skills-page__section-title">
                    <span className="gradient-text">Expériences Professionnelles</span>
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
            </div>

            {/* Interests */}
            <div className="skills-page__interests">
                <h2 className="skills-page__section-title">
                    Passions & <span className="gradient-text">Lifestyle</span>
                </h2>
                <div className="interests-grid">
                    {interests.map((interest) => (
                        <div key={interest.label} className="interest-item">
                            <span className="interest-item__icon">{interest.icon}</span>
                            <span className="interest-item__label">{interest.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
