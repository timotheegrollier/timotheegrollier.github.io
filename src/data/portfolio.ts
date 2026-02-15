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

export const projects: Project[] = [
    {
        id: 1,
        name: 'BitBrawler',
        description:
            'RPG navigateur 8-bit avec création de personnages, arène PvP, système de loot, matchmaking par niveau, bots IA avec combats simulés, et PWA installable. Backend Firebase avec reset quotidien automatisé.',
        tags: ['React', 'TypeScript', 'Firebase', 'Vite', 'SCSS', 'PWA'],
        image: '/media/bitbrawler.png',
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
        image: '/media/bpm-table.png',
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
        image: '/media/socket-tchat.png',
        sourceUrl: 'https://github.com/timotheegrollier/reactSocketChat',
        liveUrl: 'https://socket-tchat.onrender.com/',
        featured: true,
    },
];

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
