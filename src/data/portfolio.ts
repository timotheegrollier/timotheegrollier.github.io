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

export interface Skill {
    name: string;
    level: number; // 0-100
    category: 'language' | 'framework' | 'tool' | 'other';
    icon?: string;
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

export const skills: Skill[] = [
    // Languages
    { name: 'JavaScript / TypeScript', level: 95, category: 'language' },
    { name: 'PHP', level: 85, category: 'language' },
    { name: 'Python', level: 75, category: 'language' },
    { name: 'HTML5 / SCSS', level: 95, category: 'language' },
    { name: 'SQL / NoSQL', level: 80, category: 'language' },

    // Frameworks
    { name: 'React', level: 90, category: 'framework' },
    { name: 'Symfony', level: 85, category: 'framework' },
    { name: 'Node.js / Express', level: 80, category: 'framework' },
    { name: 'Vite', level: 85, category: 'framework' },
    { name: 'Tailwind / Bootstrap', level: 80, category: 'framework' },

    // Tools & DevOps
    { name: 'Git / GitHub Actions', level: 90, category: 'tool' },
    { name: 'Docker / Compose', level: 85, category: 'tool' },
    { name: 'Linux (Debian / Fedora)', level: 90, category: 'tool' },
    { name: 'CI/CD Pipelines', level: 80, category: 'tool' },
    { name: 'TDD (Test Driven Dev)', level: 75, category: 'tool' },
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
