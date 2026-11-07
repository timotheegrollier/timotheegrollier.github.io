import { useState, useEffect, useCallback } from 'react';
import { projects as staticProjects, type Project, type ReleaseInfo } from '@/data/portfolio';

const CACHE_KEY = 'timothee_portfolio_projects_v2';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

interface CachePayload {
    timestamp: number;
    projects: Project[];
}

const GITHUB_USERS = ['timotheegrollier', 'stxtxm'] as const;

const IGNORED_REPOS = new Set([
    'timotheegrollier/timotheegrollier',
    'timotheegrollier/json',
    'timotheegrollier/API',
    'timotheegrollier/pwa',
]);

export function useGitHubProjects() {
    const [projectsList, setProjectsList] = useState<Project[]>(() => {
        try {
            const raw = localStorage.getItem(CACHE_KEY);
            if (raw) {
                const parsed: CachePayload = JSON.parse(raw);
                if (Date.now() - parsed.timestamp < CACHE_TTL_MS && Array.isArray(parsed.projects)) {
                    return parsed.projects;
                }
            }
        } catch {
            // Ignore localStorage parse errors
        }
        return staticProjects;
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [lastSync, setLastSync] = useState<Date | null>(() => {
        try {
            const raw = localStorage.getItem(CACHE_KEY);
            if (raw) {
                const parsed: CachePayload = JSON.parse(raw);
                return new Date(parsed.timestamp);
            }
        } catch {
            // Ignore
        }
        return null;
    });
    const [error, setError] = useState<string | null>(null);

    const syncProjects = useCallback(async (force = false) => {
        // If not forced and cache is fresh, do not refetch
        if (!force) {
            try {
                const raw = localStorage.getItem(CACHE_KEY);
                if (raw) {
                    const parsed: CachePayload = JSON.parse(raw);
                    if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
                        setProjectsList(parsed.projects);
                        setLastSync(new Date(parsed.timestamp));
                        return;
                    }
                }
            } catch {
                // Ignore
            }
        }

        setLoading(true);
        setError(null);

        try {
            // Clone existing static list as baseline
            const mergedMap = new Map<string, Project>();
            for (const p of staticProjects) {
                const key = `${p.owner || 'timotheegrollier'}/${p.slug || p.name.toLowerCase()}`;
                mergedMap.set(key, { ...p });
            }

            // Fetch public repos from both accounts
            for (const user of GITHUB_USERS) {
                try {
                    const res = await fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=100`, {
                        headers: {
                            Accept: 'application/vnd.github.v3+json',
                        },
                    });

                    if (res.status === 403 || res.status === 429) {
                        // Rate limited by GitHub
                        console.info(`GitHub API rate limit reached for ${user}, using cached/static data.`);
                        continue;
                    }

                    if (!res.ok) continue;

                    const repos = await res.json();
                    if (!Array.isArray(repos)) continue;

                    for (const repo of repos) {
                        const fullName = `${user}/${repo.name}`;
                        if (repo.fork || IGNORED_REPOS.has(fullName)) continue;

                        const key = `${user}/${repo.name.toLowerCase()}`;
                        const existing = mergedMap.get(key);

                        if (existing) {
                            // Update live stats
                            existing.stars = repo.stargazers_count ?? existing.stars;
                            existing.updatedAt = repo.pushed_at ?? existing.updatedAt;
                            if (repo.homepage && !existing.liveUrl) {
                                existing.liveUrl = repo.homepage;
                            }
                        } else {
                            // Brand new public repo released on GitHub!
                            const primaryLang = repo.language || '';
                            const tags = primaryLang ? [primaryLang] : [];
                            if (repo.topics && Array.isArray(repo.topics)) {
                                for (const t of repo.topics) {
                                    const formatted = t.charAt(0).toUpperCase() + t.slice(1);
                                    if (!tags.includes(formatted)) tags.push(formatted);
                                }
                            }

                            const newProject: Project = {
                                id: repo.id,
                                slug: repo.name.toLowerCase(),
                                name: repo.name,
                                owner: user,
                                description: repo.description || 'Nouveau projet open-source disponible sur GitHub.',
                                tags: tags.length > 0 ? tags : ['Open Source'],
                                image: user === 'timotheegrollier' ? '/media/bpm-detector.svg' : '/media/bitbrawler.svg',
                                sourceUrl: repo.html_url,
                                liveUrl: repo.homepage || undefined,
                                featured: false,
                                stars: repo.stargazers_count || 0,
                                language: primaryLang,
                                updatedAt: repo.pushed_at,
                                createdAt: repo.created_at,
                                isLiveGithub: true,
                            };

                            mergedMap.set(key, newProject);
                        }
                    }
                } catch (userErr) {
                    console.warn(`Error updating ${user} repos:`, userErr);
                }
            }

            const updatedList = Array.from(mergedMap.values());
            updatedList.sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
                const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
                return timeB - timeA;
            });

            const now = Date.now();
            setProjectsList(updatedList);
            setLastSync(new Date(now));

            try {
                localStorage.setItem(
                    CACHE_KEY,
                    JSON.stringify({
                        timestamp: now,
                        projects: updatedList,
                    })
                );
            } catch {
                // Ignore localStorage errors (e.g. private mode quota)
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Erreur de synchronisation';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        syncProjects(false);
    }, [syncProjects]);

    return {
        projects: projectsList,
        loading,
        error,
        lastSync,
        refresh: () => syncProjects(true),
    };
}
