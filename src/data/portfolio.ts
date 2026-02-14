// ============================================
// Portfolio Data — Projects & Skills
// ============================================

export interface Project {
    id: number;
    name: string;
    description: string;
    tags: string[];
    image: string;
    sourceUrl: string;
    liveUrl?: string;
    featured?: boolean;
}

export interface Skill {
    name: string;
    level: number; // 0-100
    category: 'language' | 'framework' | 'tool' | 'other';
}

export interface Experience {
    id: number;
    title: string;
    company: string;
    period: string;
    tasks: string[];
    type: 'dev' | 'other';
}

export const projects: Project[] = [
    {
        id: 1,
        name: 'BitBrawler',
        description:
            'RPG navigateur 8-bit avec création de personnages, arène PvP, système de loot, matchmaking par niveau, bots IA avec combats simulés, et PWA installable. Backend Firebase avec reset quotidien automatisé.',
        tags: ['React', 'TypeScript', 'Firebase', 'Vite', 'SCSS', 'PWA'],
        image: '/media/bitbrawler.svg',
        sourceUrl: 'https://github.com/stxtxm/bitbrawler',
        liveUrl: 'https://bitbrawler.vercel.app',
        featured: true,
    },
    {
        id: 2,
        name: 'BPM Detector Pro',
        description:
            'Détection haute précision de BPM pour fichiers audio. GUI desktop (Tkinter), CLI pour automation, et interface web Flask. Binaires portables avec FFmpeg intégré. Supporte MP3, FLAC, WAV, M4A, OGG et plus.',
        tags: ['Python', 'Flask', 'Tkinter', 'CI/CD', 'PyInstaller'],
        image: '/media/bpm-detector.svg',
        sourceUrl: 'https://github.com/timotheegrollier/bpm-detector-pro',
        featured: true,
    },
    {
        id: 3,
        name: 'BPM Table',
        description:
            'Application web de calcul de pourcentages de transition entre BPM pour DJs. Matrice complète avec sélection source/destination, calculs BigInt sans dérive flottante, et interface responsive PWA.',
        tags: ['React', 'TypeScript', 'Vite', 'SCSS', 'PWA'],
        image: '/media/bpm-table.svg',
        sourceUrl: 'https://github.com/stxtxm/bpm-table',
        liveUrl: 'https://bpm-table.vercel.app',
        featured: true,
    },
    {
        id: 4,
        name: 'Socket-Tchat',
        description:
            'Chat en temps réel avec Socket.io. Communication bidirectionnelle instantanée, backend Express.js full JavaScript et frontend React.',
        tags: ['React', 'Node.js', 'Socket.io', 'Express'],
        image: '/media/socket-tchat.svg',
        sourceUrl: 'https://github.com/timotheegrollier/reactSocketChat',
        featured: true,
    },
];

export const skills: Skill[] = [
    // Languages
    { name: 'JavaScript', level: 90, category: 'language' },
    { name: 'TypeScript', level: 75, category: 'language' },
    { name: 'PHP', level: 80, category: 'language' },
    { name: 'Python', level: 60, category: 'language' },
    { name: 'HTML5', level: 95, category: 'language' },
    { name: 'CSS / SCSS', level: 90, category: 'language' },

    // Frameworks
    { name: 'React', level: 85, category: 'framework' },
    { name: 'Node.js', level: 75, category: 'framework' },
    { name: 'Symfony', level: 70, category: 'framework' },
    { name: 'Express', level: 70, category: 'framework' },
    { name: 'Vite', level: 80, category: 'framework' },

    // Tools
    { name: 'Git / GitHub', level: 90, category: 'tool' },
    { name: 'Docker', level: 65, category: 'tool' },
    { name: 'Firebase', level: 70, category: 'tool' },
    { name: 'Linux', level: 80, category: 'tool' },
    { name: 'VS Code', level: 90, category: 'tool' },
    { name: 'CI/CD', level: 60, category: 'tool' },
];

export const experiences: Experience[] = [
    {
        id: 1,
        title: 'Stage Développeur Web',
        company: 'Agence NOUS : Ouvert, Utile et Simple',
        period: 'Juin — Septembre 2021',
        tasks: [
            'Création de blocs WordPress JSX',
            'Intégration WordPress',
            'Mise à jour de plugins Front/Back',
            'Développement Symfony',
        ],
        type: 'dev',
    },
];

export const socialLinks = {
    github: 'https://github.com/timotheegrollier',
    linkedin: 'https://www.linkedin.com/in/timoth%C3%A9e-grollier-dev/',
    email: 'timotheegrollier@gmail.com',
    phone: '06 95 02 40 08',
    location: 'Bordeaux, France',
};
