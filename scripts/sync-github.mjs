#!/usr/bin/env node
import { writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputFile = resolve(__dirname, '../src/data/generated-projects.json');

// Retrieve GitHub Token
let token = process.env.GITHUB_TOKEN || '';
if (!token) {
    try {
        token = execSync('gh auth token', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch {
        // Unauthenticated fallback
    }
}

const headers = {
    'User-Agent': 'Portfolio-Project-Sync',
    'Accept': 'application/vnd.github.v3+json',
};
if (token) {
    headers['Authorization'] = `token ${token}`;
}

async function fetchJson(url) {
    const res = await fetch(url, { headers });
    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`HTTP ${res.status} from ${url}`);
    }
    return await res.json();
}

// Curated metadata dictionary for key projects
const curatedMetadata = {
    'timotheegrollier/maschine-linux': {
        name: 'Maschine Linux',
        description:
            'Station de travail audio / DAW sous Linux dédiée au workflow Native Instruments Maschine MK3. Moteur temps-réel Rust sur PipeWire-JACK, reverse engineering USB, double affichage couleur MK3 et séquenceur par pas.',
        tags: ['Rust', 'Linux', 'Audio / DSP', 'PipeWire', 'Hardware Reverse Engineering'],
        image: '/media/maschine-linux-banner.svg',
        featured: true,
        highlights: [
            'Reverse-engineering complet du protocole USB de la Maschine MK3 (17cc:1600)',
            'Moteur audio ultra basse latence écrit en Rust sur PipeWire-JACK (zéro allocation dans la boucle audio)',
            'Rendu graphique dynamique en temps réel sur les deux écrans LCD couleur du contrôleur',
            'Workflow complet : Projects, Groups, Sounds, Patterns, Scenes, Step Sequencer 16 pas',
        ],
        architecture: [
            'Rust (2021 edition) pour une exécution temps-réel sans pause de Garbage Collector',
            'PipeWire-JACK C API bindings & threads audio temps réel à haute priorité (SCHED_FIFO)',
            'Protocole USB bulk transfer pour alimenter le framebuffer des deux écrans MK3',
        ],
    },
    'timotheegrollier/work-logs': {
        name: 'WorkLogs',
        description:
            'Journal de travail 100% local, moderne et sans friction pour développeurs. Organisation en écran unique : journal hebdo à gauche, éditeur markdown au centre, todo list à droite. Zéro compte requis, paquets Linux natifs .deb et .rpm.',
        tags: ['TypeScript', 'React', 'Productivity', 'Desktop App', 'Linux'],
        image: '/media/work-logs-banner.svg',
        featured: true,
        highlights: [
            'Interface monobloc 1-écran : aperçu temporel, rédaction riche et tâches synchronisées',
            'Architecture 100% locale (local-first) : respect strict de la vie privée et vitesse instantanée',
            'Système de recherche plein texte instantanée et tags par mot-clé',
            'Distribution multi-distro Linux avec paquets Debian (.deb) et Fedora (.rpm) automatisés',
        ],
        architecture: [
            'React 19, TypeScript, SCSS tokens modulaires',
            'Stockage local résilient avec export JSON/Markdown et synchronisation optionnelle',
            'CI/CD GitHub Actions multi-architecture générant les paquets natifs Linux',
        ],
    },
    'timotheegrollier/bpm-detector': {
        name: 'BPM Detector Pro',
        description:
            'Outil haute précision d’analyse et détection de BPM pour fichiers musicaux. Disponible en interface graphique de bureau (Tkinter moderne), en ligne de commande (CLI) pour batch scripté, et en web Flask.',
        tags: ['Python', 'Audio / DSP', 'Tkinter', 'CLI', 'CI/CD'],
        image: '/media/bpm-detector.svg',
        featured: true,
        highlights: [
            'Algorithme de détection hybride combinant autocorrélation spectrale et analyse de transitoires',
            'Trois modes d’utilisation : application de bureau GUI, ligne de commande CLI, et serveur Flask',
            'Exécutables autonomes multi-plateformes (Linux portable x64, installeur Windows avec FFmpeg inclus)',
            'Prise en charge native de nombreux formats : MP3, FLAC, WAV, M4A, OGG, AIFF',
        ],
        architecture: [
            'Python 3 avec bibliothèques d’analyse du signal audio (NumPy, SciPy, Librosa/aubio)',
            'Interface Tkinter moderne avec threading asynchrone pour ne jamais geler l’interface utilisateur',
            'Packaging automatisé PyInstaller & Inno Setup dans GitHub Actions',
        ],
    },
    'timotheegrollier/socket-chat': {
        name: 'Socket-Tchat',
        description:
            'Messagerie instantanée bidirectionnelle temps réel propulsée par WebSockets. Refonte ergonomique mobile inspirée de Telegram avec gestion plein écran, safe areas, tiroir de composition et revalidation en arrière-plan.',
        tags: ['React', 'Node.js', 'Socket.io', 'Express', 'PWA'],
        image: '/media/socket-tchat.png',
        featured: false,
        liveUrl: 'https://socket-tchat.onrender.com/',
        highlights: [
            'Communication full-duplex ultra réactive via WebSockets Socket.io',
            'Mise en page optimisée smartphones (Telegram-like) avec gestion intelligente du clavier virtuel',
            'Reconnexion automatique et synchronisation d’état sans perte de messages',
        ],
        architecture: [
            'Frontend React + TypeScript avec styled components / SCSS',
            'Backend Node.js & Express avec serveur Socket.io',
        ],
    },
    'timotheegrollier/timotheegrollier.github.io': {
        name: 'Portfolio Développeur',
        description:
            'Portfolio personnel moderne et réactif en React 19, TypeScript et Vite. Intègre une synchronisation dynamique multi-comptes GitHub (@timotheegrollier & @stxtxm), affichage temps réel des patch notes, design glassmorphism et CI/CD GitHub Pages.',
        tags: ['React', 'TypeScript', 'Vite', 'SCSS', 'GitHub Actions'],
        image: '/media/timo.jpg',
        featured: false,
        highlights: [
            'Synchronisation dynamique temps réel avec les deux comptes GitHub @timotheegrollier et @stxtxm',
            'Extraction et rendu formaté des patch notes et artefacts de release GitHub',
            'Design sombre sur-mesure ultra fluide avec tokens SCSS et navigation accessible',
            'Déploiement continu automatisé via GitHub Pages et GitHub Actions avec cron quotidien',
        ],
        architecture: [
            'React 19, TypeScript 5.7, Vite 6',
            'GitHub REST API v3 avec cache local intelligent et fallback statique généré',
            'Workflow CI/CD GitHub Actions multi-jobs avec compilation optimisée',
        ],
    },
    'stxtxm/bitbrawler': {
        name: 'BitBrawler',
        description:
            'RPG navigateur rétro 8-bit avec arène PvP, bots IA simulant des stratégies de combat, arbre de compétences, système d’équipement et de loot, et reset quotidien automatique. PWA installable sur tous écrans.',
        tags: ['React', 'TypeScript', 'Firebase', 'Vite', 'SCSS', 'PWA'],
        image: '/media/bitbrawler.png',
        cardImageFit: 'cover',
        cardImagePosition: 'center 28%',
        modalImageFit: 'contain',
        modalImagePosition: 'center top',
        sourceUrl: 'https://github.com/stxtxm/bitbrawler',
        liveUrl: 'https://bitbrawler.pages.dev',
        featured: true,
        highlights: [
            'Système de combat au tour par tour dynamique inspiré des classiques RPG 8-bit',
            'Arène PvP avec matchmaking basé sur le niveau et bots IA adaptatifs',
            'Persistance temps réel Firebase Firestore avec cron de reset quotidien',
            'Expérience PWA responsive installable hors-ligne',
        ],
        architecture: [
            'React 18 / TypeScript, bundler Vite pour des performances optimales',
            'Backend serverless Firebase (Firestore, Cloud Functions)',
            'Déploiement continu via Cloudflare Pages',
        ],
    },
    'stxtxm/bpm-table': {
        name: 'BPM Table',
        description:
            'Application web d’aide aux transitions DJ permettant de calculer instantanément les pourcentages de pitch entre deux tempos. Matrice complète avec sélection bidirectionnelle et calculs haute précision sans dérive flottante.',
        tags: ['React', 'TypeScript', 'Vite', 'SCSS', 'PWA', 'Audio / DJ'],
        image: '/media/bpm-table.png',
        sourceUrl: 'https://github.com/stxtxm/bpm-table',
        liveUrl: 'https://bpm-table.vercel.app',
        featured: true,
        highlights: [
            'Calculs arithmétiques BigInt déterministes à précision fixe (zéro dérive flottante)',
            'Matrice de conversion interactive de 60 à 180 BPM avec filtres d’écart de tempo',
            'Interface réactive mobile-first pensée pour l’éclairage tamisé des cabines DJ',
            'PWA installable avec support offline complet via Service Worker',
        ],
        architecture: [
            'React + TypeScript avec typage strict',
            'SCSS responsive avec variables CSS modernes et animations subtiles',
            'Hébergement Vercel avec CI/CD automatisée',
        ],
    },
    'stxtxm/global-share': {
        name: 'GlobalShare',
        description:
            'Partage de fichiers direct entre appareils via WebRTC P2P chiffré, sans création de compte ni installation. Salon éphémère par code unique, streaming direct local ou internet avec repli automatique par relais Cloudflare Workers.',
        tags: ['TypeScript', 'WebRTC', 'PWA', 'P2P', 'Cloudflare Workers'],
        image: '/media/global-share-banner.svg',
        sourceUrl: 'https://github.com/stxtxm/global-share',
        liveUrl: 'https://stxtxm.github.io/global-share',
        featured: true,
        highlights: [
            'Transfert pair-à-pair direct (P2P) à débit maximal sans upload sur des serveurs tiers',
            'Aucune création de compte, aucun pistage, salons de partage éphémères par code court',
            'Repli de secours automatique par relais WebSocket lorsque le P2P strict est bloqué par des pare-feux stricts',
            'Progressive Web App installable sur mobile, tablette et desktop',
        ],
        architecture: [
            'Next.js export statique (SSG) déployé sur GitHub Pages',
            'WebRTC DataChannels avec chiffrement DTLS / SRTP',
            'Signalisation serverless sur Cloudflare Workers',
        ],
    },
    'stxtxm/fedora-wifi-sound-link': {
        name: 'Fedora Wifi Sound Link',
        description:
            'Streaming audio sans fil haute fidélité studio entre Fedora (PipeWire) et un Raspberry Pi connecté à une carte son AudioBox USB 96 et des enceintes KRK Rokit. Algorithme anti-saccades Roc Toolkit (FEC) et application de contrôle Android.',
        tags: ['Python', 'Audio / DSP', 'PipeWire', 'Raspberry Pi', 'Networking'],
        image: '/media/fedora-wifi-sound-link-banner.svg',
        sourceUrl: 'https://github.com/stxtxm/fedora-wifi-sound-link',
        featured: true,
        highlights: [
            'Flux audio PipeWire direct vers Raspberry Pi sans aucune coupure même sur Wi-Fi instable',
            'Protocole Roc Toolkit avec Forward Error Correction (FEC) et buffer adaptatif anti-jitter',
            'Interface graphique moderne CustomTkinter en mode sombre avec VU-mètres stéréophoniques',
            'Application Android compagnon pour ajuster le volume et contrôler la liaison',
        ],
        architecture: [
            'Python 3 + CustomTkinter pour l’interface utilisateur',
            'Roc Toolkit C bindings / PipeWire pulse bridge pour le transport audio temps-réel',
            'Serveur audio Raspberry Pi optimisé sous ALSA / PipeWire basse latence',
        ],
    },
    'stxtxm/visualize': {
        name: 'Visualize',
        description:
            'Générateur de visualisations audio psychédéliques haute performance inspiré de Winamp et Windows Media Player. Effet Trance Scope synchronisé au tempo, incrustation d’arrière-plans et export vidéo MP4 accéléré par GPU.',
        tags: ['Python', 'Audio Visualizer', 'FFmpeg', 'OpenGL', 'Desktop'],
        image: '/media/visualize-banner.svg',
        sourceUrl: 'https://github.com/stxtxm/visualize',
        featured: true,
        highlights: [
            'Moteur de rendu spectral BPM-synced avec bloom dynamique et glyphes orbitaux',
            'Prévisualisation temps-réel et export vidéo MP4 haute fidélité (FFmpeg)',
            'Personnalisation complète : image de fond, placement libre de filigrane / logo et couleurs',
            'Package portable AppImage pour Linux et exécutable Windows',
        ],
        architecture: [
            'Python 3, analyse spectrale FFT du signal audio',
            'Intégration FFmpeg pour l’encodage vidéo synchrone',
            'Workflow CI GitHub Actions avec compilation AppImage multi-plateforme',
        ],
    },
    'stxtxm/vibe-telegram-bot': {
        name: 'Vibe Telegram Bot',
        description:
            'Client Telegram complet pour piloter et superviser Mistral Vibe à distance via le protocole ACP (Agent Communication Protocol). Gestion de sessions, navigation dans les fichiers du projet, exécution de commandes et suivi des tâches.',
        tags: ['TypeScript', 'Node.js', 'Mistral AI', 'Telegram Bot', 'Agentic AI'],
        image: '/media/vibe-telegram-bot.svg',
        sourceUrl: 'https://github.com/stxtxm/vibe-telegram-bot',
        featured: true,
        highlights: [
            'Pont de communication complet entre Telegram et le protocole ACP de Mistral Vibe',
            'Contrôle distant des sessions IA : prompts, validations, arrêt/reprise de génération',
            'Exploration interactive du système de fichiers du projet directement depuis le chat',
            'Gestionnaire de todos intégré pour suivre la progression des tâches en cours',
        ],
        architecture: [
            'Node.js & TypeScript avec typage strict',
            'Telegram Bot API (telegraf / grammy) avec streaming markdown',
            'Protocole ACP (Agent Communication Protocol) en streaming bidirectionnel',
        ],
    },
    'stxtxm/local-ai': {
        name: 'Local AI Stack',
        description:
            'Stack Docker Compose clé en main pour faire tourner des modèles de langage locaux (LLMs) sans connexion cloud. Associe le moteur Ollama et l’interface de discussion moderne Open-WebUI.',
        tags: ['Docker', 'Ollama', 'Open-WebUI', 'Local LLM', 'DevOps'],
        image: '/media/local-ai.svg',
        sourceUrl: 'https://github.com/stxtxm/local-ai',
        featured: false,
        highlights: [
            'Déploiement en 1 commande via Docker Compose avec persistance des modèles et des historiques',
            'Accélération matérielle GPU (NVIDIA CUDA / AMD ROCm) automatique',
            'Interface web réactive Open-WebUI riche en fonctionnalités (RAG, paramètres de température, rôles)',
            'Confidentialité totale : aucune donnée ne quitte votre machine',
        ],
        architecture: [
            'Docker & Docker Compose',
            'Ollama pour l’inférence locale de modèles (Llama, Mistral, Qwen, DeepSeek)',
            'Open-WebUI pour l’interface utilisateur web responsive',
        ],
    },
};

const ignoredRepos = new Set([
    'timotheegrollier/timotheegrollier', // profile readme config
    'timotheegrollier/json',
    'timotheegrollier/API',
    'timotheegrollier/pwa', // fork
]);

const users = ['timotheegrollier', 'stxtxm'];

async function run() {
    console.log('🔄 Fetching public repositories for:', users.join(', '));
    const allProjects = [];

    try {
        for (const user of users) {
            try {
                const repos = await fetchJson(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=100`);
                if (!Array.isArray(repos)) continue;

                for (const repo of repos) {
                    const fullName = `${user}/${repo.name}`;
                    if (repo.fork || ignoredRepos.has(fullName)) continue;

                    let latestRelease = null;

                    try {
                        const rel = await fetchJson(`https://api.github.com/repos/${user}/${repo.name}/releases/latest`);
                        if (rel && rel.tag_name) {
                            latestRelease = {
                                version: rel.tag_name,
                                name: rel.name || rel.tag_name,
                                publishedAt: rel.published_at,
                                body: rel.body || '',
                                htmlUrl: rel.html_url,
                                assets: (rel.assets || []).map((a) => ({
                                    name: a.name,
                                    downloadUrl: a.browser_download_url,
                                    size: a.size,
                                    downloadCount: a.download_count,
                                })),
                            };
                        }
                    } catch (e) {
                        // No release or rate limited
                    }

                    const curated = curatedMetadata[fullName] || {};

                    const primaryLang = repo.language || '';
                    const baseTags = curated.tags ? [...curated.tags] : (primaryLang ? [primaryLang] : []);
                    if (repo.topics && Array.isArray(repo.topics)) {
                        for (const t of repo.topics) {
                            const formatted = t.charAt(0).toUpperCase() + t.slice(1);
                            if (!baseTags.includes(formatted)) baseTags.push(formatted);
                        }
                    }

                    let image = curated.image;
                    if (!image) {
                        if (user === 'timotheegrollier') {
                            image = '/media/bpm-detector.svg';
                        } else {
                            image = '/media/bitbrawler.svg';
                        }
                    }

                    const projectItem = {
                        id: repo.id,
                        slug: repo.name.toLowerCase(),
                        name: curated.name || repo.name,
                        owner: user,
                        description: curated.description || repo.description || 'Projet open-source disponible sur GitHub.',
                        tags: baseTags,
                        image,
                        cardImageFit: curated.cardImageFit || 'cover',
                        cardImagePosition: curated.cardImagePosition || 'center',
                        modalImageFit: curated.modalImageFit || 'contain',
                        modalImagePosition: curated.modalImagePosition || 'center top',
                        sourceUrl: repo.html_url,
                        liveUrl: curated.liveUrl || repo.homepage || undefined,
                        featured: curated.featured ?? (repo.stargazers_count > 0 || Boolean(latestRelease)),
                        stars: repo.stargazers_count || 0,
                        language: primaryLang,
                        updatedAt: repo.pushed_at,
                        createdAt: repo.created_at,
                        latestRelease: latestRelease || undefined,
                        highlights: curated.highlights || undefined,
                        architecture: curated.architecture || undefined,
                        isLiveGithub: true,
                    };

                    allProjects.push(projectItem);
                }
            } catch (err) {
                console.warn(`Warning fetching repos for ${user}:`, err.message);
            }
        }

        if (allProjects.length > 0) {
            allProjects.sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            });

            writeFileSync(outputFile, JSON.stringify(allProjects, null, 2), 'utf8');
            console.log(`✅ Successfully generated ${allProjects.length} projects into ${outputFile}`);
        } else if (existsSync(outputFile)) {
            console.log(`ℹ️ Preserving existing generated projects at ${outputFile}`);
        }
    } catch (globalErr) {
        console.warn('Sync failed with error, falling back to existing data:', globalErr.message);
        if (!existsSync(outputFile)) {
            process.exit(1);
        }
    }
}

run();
