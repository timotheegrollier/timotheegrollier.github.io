// Utility helpers for dates, file sizes, and language branding

export function formatFriendlyDate(dateStr?: string): string {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '';

        return new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }).format(date);
    } catch {
        return '';
    }
}

export function formatRelativeTime(dateStr?: string): string {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        const now = new Date();
        const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffSeconds < 60) return "À l'instant";
        if (diffSeconds < 3600) return `Il y a ${Math.floor(diffSeconds / 60)} min`;
        if (diffSeconds < 86400) return `Il y a ${Math.floor(diffSeconds / 3600)} h`;
        if (diffSeconds < 86400 * 30) return `Il y a ${Math.floor(diffSeconds / 86400)} j`;

        return formatFriendlyDate(dateStr);
    } catch {
        return '';
    }
}

export function formatBytes(bytes?: number): string {
    if (!bytes || bytes <= 0) return '';
    const units = ['o', 'Ko', 'Mo', 'Go'];
    let val = bytes;
    let unitIdx = 0;
    while (val >= 1024 && unitIdx < units.length - 1) {
        val /= 1024;
        unitIdx++;
    }
    return `${val.toFixed(1)} ${units[unitIdx]}`;
}

export function getLanguageColor(language?: string): string {
    switch (language?.toLowerCase()) {
        case 'rust':
            return '#dea584';
        case 'typescript':
            return '#3178c6';
        case 'javascript':
            return '#f7df1e';
        case 'python':
            return '#3572a5';
        case 'php':
            return '#4f5d95';
        case 'shell':
        case 'bash':
            return '#89e051';
        case 'html':
            return '#e34c26';
        case 'scss':
        case 'css':
            return '#c6538c';
        case 'lua':
            return '#000080';
        default:
            return '#24b8ff';
    }
}
