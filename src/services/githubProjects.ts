import { useState, useEffect, useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';
import { projects as staticProjects, type Project, type ReleaseInfo } from '@/data/portfolio';

const CACHE_KEY = 'timothee_portfolio_projects_v3';

// Background revalidation: data older than this triggers a silent refresh
const STALE_AFTER_MS = 15 * 60 * 1000;
// Repos verified as "no release" are not re-checked for 24h (saves rate limit)
const NO_RELEASE_RECHECK_MS = 24 * 60 * 60 * 1000;
const RELEASE_POOL_SIZE = 3;
const MAX_RELEASE_BODY_CHARS = 20000;
const MAX_ASSETS = 12;

const GITHUB_USERS = ['timotheegrollier', 'stxtxm'] as const;

const IGNORED_REPOS = new Set([
    'timotheegrollier/timotheegrollier',
    'timotheegrollier/json',
    'timotheegrollier/api',
    'timotheegrollier/pwa',
    'timotheegrollier/timotheegrollier.github.io',
    'timotheegrollier/tims_weather_app',
    'timotheegrollier/ux-live-component',
    'timotheegrollier/wolfy',
    'timotheegrollier/hmj',
    'timotheegrollier/snake',
    'timotheegrollier/shortx',
    'timotheegrollier/mycave',
    'timotheegrollier/countriespeople',
    'timotheegrollier/matrix-gradient',
    'timotheegrollier/audio',
    'timotheegrollier/turbo-chat',
    'timotheegrollier/3dcube',
    'timotheegrollier/petmvc',
    'timotheegrollier/pygametuto',
    'timotheegrollier/freebird',
    'timotheegrollier/reactcountries',
    'timotheegrollier/reduxcours',
    'timotheegrollier/randomuserajax',
    'timotheegrollier/passwordgenerator',
    'timotheegrollier/kassbrik',
    'timotheegrollier/apachephpdocker',
    'timotheegrollier/mysql-full-js',
    'timotheegrollier/shifoumi',
    'timotheegrollier/slymeupdated',
    'timotheegrollier/reactsymfonystarterpack',
    'timotheegrollier/bard-cli',
    'timotheegrollier/youtubeparser',
    'timotheegrollier/findthebeat',
    'timotheegrollier/shooter-js',
    'timotheegrollier/dead-fish-counter',
    'stxtxm/cline-baseline',
    'stxtxm/g-manager',
    'stxtxm/gpto',
    'stxtxm/joke-generator',
    'stxtxm/instabot',
    'stxtxm/vpn-saph',
    'stxtxm/event-unlined',
]);

interface CachePayload {
    timestamp: number;
    projects: Project[];
    noRelease: Record<string, number>;
    repoSnapshots: Partial<Record<(typeof GITHUB_USERS)[number], { etag?: string; repos: unknown[] }>>;
}

// ------------------------------------------------------------------
// Cache helpers
// ------------------------------------------------------------------

function readCache(): CachePayload | null {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as CachePayload;
        if (!Array.isArray(parsed.projects) || parsed.projects.length === 0) return null;
        return {
            timestamp: parsed.timestamp || 0,
            projects: parsed.projects,
            noRelease: parsed.noRelease || {},
            repoSnapshots: parsed.repoSnapshots || {},
        };
    } catch {
        return null;
    }
}

function writeCache(payload: CachePayload) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
    } catch {
        // Quota / private mode — non blocking, data stays in memory
    }
}

// ------------------------------------------------------------------
// Version comparison (semver-ish, tolerant to 'v' prefix & suffixes)
// Returns > 0 if a is newer, < 0 if b is newer, 0 if equal
// ------------------------------------------------------------------

export function compareVersions(a?: string, b?: string): number {
    if (!a && !b) return 0;
    if (!a) return -1;
    if (!b) return 1;
    const parse = (v: string) =>
        v
            .trim()
            .replace(/^v/i, '')
            .split('-')[0]
            .split('.')
            .map((n) => parseInt(n, 10) || 0);
    const pa = parse(a);
    const pb = parse(b);
    const len = Math.max(pa.length, pb.length);
    for (let i = 0; i < len; i++) {
        const diff = (pa[i] || 0) - (pb[i] || 0);
        if (diff !== 0) return diff;
    }
    return 0;
}

function toReleaseInfo(rel: {
    tag_name?: string;
    name?: string | null;
    published_at?: string | null;
    body?: string | null;
    html_url?: string;
    assets?: Array<{ name?: string; browser_download_url?: string; size?: number; download_count?: number }>;
}): ReleaseInfo | null {
    if (!rel?.tag_name || !rel.html_url) return null;
    return {
        version: rel.tag_name,
        name: rel.name || rel.tag_name,
        publishedAt: rel.published_at ?? new Date().toISOString(),
        body: (rel.body || '').slice(0, MAX_RELEASE_BODY_CHARS),
        htmlUrl: rel.html_url,
        assets: (rel.assets || []).slice(0, MAX_ASSETS).map((a) => ({
            name: a.name || 'asset',
            downloadUrl: a.browser_download_url || '',
            size: a.size || 0,
            downloadCount: a.download_count || 0,
        })),
    };
}

// Simple concurrency-limited pool
async function mapPool<T>(items: T[], limit: number, fn: (item: T) => Promise<void>): Promise<void> {
    let index = 0;
    const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
        while (index < items.length) {
            const item = items[index++];
            await fn(item);
        }
    });
    await Promise.all(workers);
}

function sortByFeaturedAndDate(list: Project[]): Project[] {
    return [...list].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return timeB - timeA;
    });
}

// ------------------------------------------------------------------
// Hook
// ------------------------------------------------------------------

export function useGitHubProjects() {
    const cacheRef = useRef<CachePayload | null>(null);
    if (cacheRef.current === null) {
        cacheRef.current = readCache();
    }

    const [projects, setProjects] = useState<Project[]>(() => cacheRef.current?.projects ?? staticProjects);
    const [loading, setLoading] = useState<boolean>(false);
    const [lastSync, setLastSync] = useState<Date | null>(() => {
        const ts = cacheRef.current?.timestamp || 0;
        return ts > 0 ? new Date(ts) : null;
    });
    const [error, setError] = useState<string | null>(null);
    const mountedRef = useRef(true);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            abortRef.current?.abort();
        };
    }, []);

    const commit = useCallback((next: Project[], timestamp: number) => {
        const apply = () => {
            if (!mountedRef.current) return;
            setProjects(next);
            setLastSync(new Date(timestamp));
        };
        // Smooth layout update when the browser supports View Transitions:
        // cards cross-fade / slide to their new spot instead of snapping.
        const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
        if (!doc.startViewTransition) {
            apply();
            return;
        }
        doc.startViewTransition(() => {
            flushSync(apply);
        });
    }, []);

    const syncProjects = useCallback(async (force = false) => {
        const cached = readCache();

        // Stale-while-revalidate: serve cached data instantly, refresh in
        // background. A manual click on "Rafraîchir" always forces sync.
        if (!force && cached && Date.now() - cached.timestamp < STALE_AFTER_MS) {
            setProjects(cached.projects);
            setLastSync(new Date(cached.timestamp));
            return;
        }

        setLoading(true);
        setError(null);
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        const signal = controller.signal;

        try {
            // Curated build-time metadata is the stable base (images, highlights,
            // architecture, curated descriptions). Live GitHub data is merged on
            // top so curated content is never lost by a client-side refresh.
            const mergedMap = new Map<string, Project>();
            for (const p of staticProjects) {
                const key = `${p.owner || 'timotheegrollier'}/${(p.slug || p.name.toLowerCase()).toLowerCase()}`;
                mergedMap.set(key, { ...p });
            }

            const noRelease: Record<string, number> = { ...(cached?.noRelease ?? {}) };
            const repoSnapshots: CachePayload['repoSnapshots'] = { ...(cached?.repoSnapshots ?? {}) };

            // 1) Fetch repos for both accounts (ETag → free 304 when unchanged)
            await Promise.all(
                GITHUB_USERS.map(async (user) => {
                    const snapshot = repoSnapshots[user];
                    const headers: Record<string, string> = {
                        Accept: 'application/vnd.github.v3+json',
                    };
                    if (snapshot?.etag) headers['If-None-Match'] = snapshot.etag;

                    try {
                        const res = await fetch(
                            `https://api.github.com/users/${user}/repos?sort=pushed&per_page=100`,
                            { headers, signal }
                        );

                        const applySnapshot = () => {
                            if (snapshot && Array.isArray(snapshot.repos)) {
                                for (const repo of snapshot.repos as Array<Record<string, unknown>>) {
                                    applyRepo(user, repo, mergedMap);
                                }
                                return true;
                            }
                            return false;
                        };

                        if (res.status === 403 || res.status === 429) {
                            // Rate limited: fall back to the stored snapshot, if any.
                            applySnapshot();
                            return;
                        }

                        if (res.status === 304 && applySnapshot()) {
                            // Cache revalidated for free (304s don't count against quota)
                            return;
                        }

                        if (!res.ok) {
                            applySnapshot();
                            return;
                        }

                        const repos = (await res.json()) as Array<Record<string, unknown>>;
                        if (!Array.isArray(repos)) return;

                        const etag = res.headers?.get?.('etag') || snapshot?.etag;
                        repoSnapshots[user] = { etag: etag || undefined, repos };
                        for (const repo of repos) {
                            applyRepo(user, repo, mergedMap);
                        }
                    } catch (err) {
                        if ((err as Error)?.name === 'AbortError') throw err;
                        if (snapshot && Array.isArray(snapshot.repos)) {
                            for (const repo of snapshot.repos as Array<Record<string, unknown>>) {
                                applyRepo(user, repo, mergedMap);
                            }
                        }
                    }
                })
            );

            // 2) Live releases: refresh versions that build-time data may have
            //    gone stale on (0.12.0 shown instead of 0.14.0, …).
            //    - repos already in cache keep their release info;
            //    - repos confirmed without release are skipped for 24h;
            //    - only projects present client-side are checked.
            const candidates: Array<{ project: Project; key: string }> = [];
            for (const [key, project] of mergedMap) {
                const verifiedAt = noRelease[key];
                if (verifiedAt && Date.now() - verifiedAt < NO_RELEASE_RECHECK_MS) continue;
                candidates.push({ project, key });
            }

            let releaseRateLimited = false;
            await mapPool(candidates, RELEASE_POOL_SIZE, async ({ project, key }) => {
                if (releaseRateLimited || signal.aborted) return;
                try {
                    const res = await fetch(
                        `https://api.github.com/repos/${key}/releases/latest`, { signal }
                    );
                    if (res.status === 404) {
                        noRelease[key] = Date.now();
                        return;
                    }
                    if (res.status === 403 || res.status === 429) {
                        releaseRateLimited = true; // stop wasting the remaining quota
                        return;
                    }
                    if (!res.ok) return;
                    const rel = await res.json();
                    const info = toReleaseInfo(rel);
                    if (!info) {
                        noRelease[key] = Date.now();
                        return;
                    }
                    const existing = project.latestRelease;
                    // Only replace when the live release is newer than the cached one
                    const cmp = compareVersions(info.version, existing?.version);
                    const isNewer =
                        !existing ||
                        cmp > 0 ||
                        (cmp === 0 &&
                            new Date(info.publishedAt || 0).getTime() >
                                new Date(existing.publishedAt || 0).getTime());
                    if (isNewer) {
                        project.latestRelease = info;
                    }
                } catch (err) {
                    if ((err as Error)?.name === 'AbortError') return;
                    // Network error on one release: ignore, keep cached value
                }
            });

            const updatedList = sortByFeaturedAndDate(Array.from(mergedMap.values()));
            const now = Date.now();

            // Avoid pointless re-renders when nothing actually changed
            const currentJson = JSON.stringify(projects);
            const nextJson = JSON.stringify(updatedList);

            if (currentJson !== nextJson) {
                commit(updatedList, now);
            } else if (force || !cached || Date.now() - cached.timestamp > STALE_AFTER_MS) {
                if (mountedRef.current) setLastSync(new Date(now));
            }

            writeCache({
                timestamp: now,
                projects: updatedList,
                noRelease,
                repoSnapshots,
            });
        } catch (err: unknown) {
            if ((err as Error)?.name === 'AbortError') return;
            const msg = err instanceof Error ? err.message : 'Erreur de synchronisation';
            setError(msg);
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    }, [commit, projects]);

    useEffect(() => {
        syncProjects(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        projects,
        loading,
        error,
        lastSync,
        refresh: () => syncProjects(true),
    };
}

// ------------------------------------------------------------------
// Repo → Project merge
// ------------------------------------------------------------------

function applyRepo(
    user: (typeof GITHUB_USERS)[number],
    repo: Record<string, unknown>,
    mergedMap: Map<string, Project>
) {
    const name = String(repo.name || '');
    if (!name) return;
    const slug = name.toLowerCase();
    if (repo.fork) return;
    if (IGNORED_REPOS.has(`${user}/${name}`.toLowerCase()) || IGNORED_REPOS.has(slug)) return;

    const key = `${user}/${slug}`;
    const existing = mergedMap.get(key);
    const stars = typeof repo.stargazers_count === 'number' ? repo.stargazers_count : undefined;
    const updatedAt = (repo.pushed_at as string) || undefined;
    const homepage = (repo.homepage as string) || undefined;

    if (existing) {
        if (stars !== undefined) existing.stars = stars;
        if (updatedAt) existing.updatedAt = updatedAt;
        if (homepage && !existing.liveUrl) existing.liveUrl = homepage;
        return;
    }

    const primaryLang = (repo.language as string) || '';
    const tags: string[] = primaryLang ? [primaryLang] : [];
    if (Array.isArray(repo.topics)) {
        for (const t of repo.topics as string[]) {
            const formatted = t.charAt(0).toUpperCase() + t.slice(1);
            if (!tags.includes(formatted)) tags.push(formatted);
        }
    }

    mergedMap.set(key, {
        id: (repo.id as number) || `${key}`,
        slug,
        name,
        owner: user,
        description:
            (repo.description as string) || 'Nouveau projet open-source disponible sur GitHub.',
        tags: tags.length > 0 ? tags : ['Open Source'],
        image: user === 'timotheegrollier' ? '/media/bpm-detector.svg' : '/media/bitbrawler.svg',
        sourceUrl: (repo.html_url as string) || `https://github.com/${user}/`,
        liveUrl: homepage || undefined,
        featured: false,
        stars: stars || 0,
        language: primaryLang,
        updatedAt,
        createdAt: (repo.created_at as string) || undefined,
        isLiveGithub: true,
    });
}
