import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function githubPagesRouteEntries(): Plugin {
    return {
        name: 'github-pages-route-entries',
        enforce: 'post',
        apply: 'build',
        generateBundle(_options, bundle) {
            const indexHtml = bundle['index.html'];
            if (!indexHtml || indexHtml.type !== 'asset') {
                throw new Error('Could not find the generated index.html entry');
            }

            this.emitFile({
                type: 'asset',
                fileName: 'competences/index.html',
                source: indexHtml.source,
            });
        },
    };
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), githubPagesRouteEntries()],
    css: {
        preprocessorOptions: {
            scss: {
                // Make SCSS variables available in all files
                additionalData: `@use "@/styles/tokens" as *;\n`,
            },
        },
    },
    resolve: {
        alias: {
            '@': '/src',
        },
    },
});
