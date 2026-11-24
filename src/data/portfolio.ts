// ============================================
// Portfolio Data — Projects & Skills
// ============================================
import rawProjects from './generated-projects.json';

export interface ReleaseAsset {
    name: string;
    downloadUrl: string;
    size: number;
    downloadCount?: number;
}

export interface ReleaseInfo {
    version: string;
    name: string;
    publishedAt: string;
    body: string;
    htmlUrl: string;
    assets?: ReleaseAsset[];
}

export interface Project {
    id: number | string;
    slug?: string;
    name: string;
    owner?: 'timotheegrollier' | 'stxtxm' | string;
    description: string;
    tags: string[];
    image: string;
    cardImageFit?: 'cover' | 'contain';
    cardImagePosition?: string;
    modalImageFit?: 'cover' | 'contain';
    modalImagePosition?: string;
    sourceUrl: string;
    liveUrl?: string;
    featured?: boolean;
    stars?: number;
    language?: string;
    updatedAt?: string;
    createdAt?: string;
    latestRelease?: ReleaseInfo;
    highlights?: string[];
    architecture?: string[];
    isLiveGithub?: boolean;
}

// daily: utilisé régulièrement · solid: maîtrisé sur des projets réels · exploring: en apprentissage actif
export type SkillTier = 'daily' | 'solid' | 'exploring';
// pro: en entreprise · perso: projets personnels · both: les deux
export type SkillContext = 'pro' | 'perso' | 'both';

export interface Skill {
    name: string;
    tier: SkillTier;
    context: SkillContext;
}

export interface SkillGroup {
    id: string;
    title: string;
    icon: string;
    summary: string;
    skills: Skill[];
}

export interface Experience {
    id: number;
    title: string;
    company: string;
    period: string;
    tasks: string[];
    type: 'dev' | 'other';
}

export const projects: Project[] = rawProjects as unknown as Project[];

export const skillGroups: SkillGroup[] = [
    {
        id: 'web',
        title: 'Web & Applications',
        icon: '🧩',
        summary: 'Interfaces React/TypeScript, du produit métier aux PWA temps réel.',
        skills: [
            { name: 'TypeScript / JavaScript', tier: 'daily', context: 'both' },
            { name: 'React', tier: 'daily', context: 'both' },
            { name: 'HTML5 / SCSS', tier: 'daily', context: 'both' },
            { name: 'Vite', tier: 'daily', context: 'both' },
            { name: 'PWA & mode hors-ligne', tier: 'solid', context: 'perso' },
            { name: 'WebSocket & WebRTC', tier: 'solid', context: 'perso' },
        ],
    },
    {
        id: 'backend',
        title: 'Backend & Données',
        icon: '🗄️',
        summary: 'APIs Symfony pour l\'ERP, services serverless et bases de données.',
        skills: [
            { name: 'Symfony 6 / PHP', tier: 'daily', context: 'pro' },
            { name: 'SQL / NoSQL', tier: 'solid', context: 'both' },
            { name: 'Node.js', tier: 'solid', context: 'perso' },
            { name: 'Cloudflare Workers & Durable Objects', tier: 'solid', context: 'perso' },
            { name: 'Firebase Firestore', tier: 'solid', context: 'perso' },
            { name: 'Python', tier: 'solid', context: 'perso' },
            { name: 'Rust', tier: 'exploring', context: 'perso' },
        ],
    },
    {
        id: 'infra',
        title: 'Infra & DevOps',
        icon: '🛠️',
        summary: 'Serveurs Linux, virtualisation et chaînes CI/CD conteneurisées.',
        skills: [
            { name: 'Linux (Debian / Fedora)', tier: 'daily', context: 'both' },
            { name: 'Docker / Compose', tier: 'daily', context: 'both' },
            { name: 'CI/CD (GitHub Actions)', tier: 'daily', context: 'both' },
            { name: 'Git · Git Flow · Code review', tier: 'daily', context: 'both' },
            { name: 'Proxmox & virtualisation', tier: 'solid', context: 'pro' },
            { name: 'TDD', tier: 'solid', context: 'pro' },
            { name: 'Cloudflare Pages / Vercel / Render', tier: 'solid', context: 'both' },
        ],
    },
    {
        id: 'lab',
        title: 'IA, Audio & Hardware',
        icon: '🎛️',
        summary: 'Mes side projects : agents IA, DSP temps réel et matériel détourné.',
        skills: [
            { name: 'IA générative & vibe coding', tier: 'daily', context: 'perso' },
            { name: 'Agents & ACP (Mistral)', tier: 'solid', context: 'perso' },
            { name: 'LLM local (Ollama)', tier: 'solid', context: 'perso' },
            { name: 'Audio / DSP & PipeWire', tier: 'solid', context: 'perso' },
            { name: 'Raspberry Pi & réseau', tier: 'solid', context: 'perso' },
            { name: 'Reverse engineering USB', tier: 'exploring', context: 'perso' },
        ],
    },
];

export const experiences: Experience[] = [
    {
        id: 1,
        title: 'Développeur Informatique',
        company: 'Les Fils de Charles Murgat',
        period: '2023 — Aujourd\'hui',
        tasks: [
            'Conception et déploiement de l\'architecture serveur sous Linux (Debian).',
            'Mise en place de la virtualisation (Proxmox) pour la gestion des VMs et des backups.',
            'Refonte complète et modernisation de l\'ERP métier (Legacy -> Symfony 6 + React/TypeScript).',
            'Architecture conteneurisée avec Docker et CI/CD automatisé.',
            'Adoption des bonnes pratiques : TDD, Code Review, Git Flow.',
        ],
        type: 'dev',
    },
    {
        id: 2,
        title: 'Stage Développeur Web',
        company: 'Agence NOUS : Ouvert, Utile et Simple',
        period: 'Juin — Septembre 2021',
        tasks: [
            'Création de blocs WordPress Gutenberg sur mesure (React).',
            'Développement de plugins Symfony pour des besoins spécifiques.',
            'Maintenance évolutive et corrective de sites clients.',
        ],
        type: 'dev',
    },
];

export const interests = [
    { label: 'Océan, Nature & Bodyboard', icon: '🌊' },
    { label: 'Guitare & MAO', icon: '🎸' },
    { label: 'Musiques Électroniques & Underground', icon: '🔊' },
    { label: 'Vibe Coding & IA', icon: '🤖' },
    { label: 'Jeux Vidéo & Rétro', icon: '🎮' },
];

export const socialLinks = {
    github: 'https://github.com/timotheegrollier',
    linkedin: 'https://www.linkedin.com/in/timoth%C3%A9e-grollier-dev/',
    email: 'timotheegrollier@gmail.com',
    phone: '06 95 02 40 08',
    location: 'Lyon / Bordeaux, France',
};
