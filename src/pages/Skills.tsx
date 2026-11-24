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
                    .filter((skill) => skill.tier === 'exploring' && skill.focus)
                    .map((skill) => ({ skill, group: group.title, focus: skill.focus! }))
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
                    De l'ERP métier aux projets personnels, ces compétences reflètent ce que je pratique
                    au quotidien, ce que j'ai déjà mis en œuvre et les sujets que j'explore en construisant.
                </p>
                <ul className="skills-legend" aria-label="Légende">
                    <li><span className="skill-tag skill-tag--tier skill-tag--daily">Au quotidien</span> utilisé régulièrement</li>
                    <li><span className="skill-tag skill-tag--tier skill-tag--solid">Maîtrisé</span> mis en œuvre sur des projets réels</li>
                    <li><span className="skill-tag skill-tag--tier skill-tag--exploring">En exploration</span> en apprentissage actif</li>
                </ul>
            </header>

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

            {focus.length > 0 && (
                <section className="skills-focus" aria-labelledby="skills-focus-title">
                    <div className="skills-focus__intro">
                        <span className="skills-focus__eyebrow">Apprendre en construisant</span>
                        <h2 className="skills-page__section-title" id="skills-focus-title">
                            Ce que je creuse <span className="gradient-text">en ce moment</span>
                        </h2>
                        <p>Deux sujets que je fais avancer concrètement dans Maschine Linux.</p>
                    </div>
                    <ul className="skills-focus__list">
                        {focus.map(({ skill, group, focus: details }) => (
                            <li key={skill.name} className="skills-focus__item">
                                <div className="skills-focus__item-head">
                                    <span className="skills-focus__name">{skill.name}</span>
                                    <span className="skills-focus__project">{details.project}</span>
                                </div>
                                <p className="skills-focus__description">{details.description}</p>
                                <span className="skills-focus__group">{group} · projet personnel</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

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
                                <div className="timeline__meta">
                                    <span className="timeline__period">{exp.period}</span>
                                    {exp.current && <span className="timeline__current">Poste actuel</span>}
                                </div>
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
