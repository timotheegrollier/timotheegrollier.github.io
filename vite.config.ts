import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
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
