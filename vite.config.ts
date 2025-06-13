import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    assetsInclude: ['**/*.csv'],
    plugins: [
        sveltekit(),
        tailwindcss(),
    ],
    server: {
        fs: {
          cachedChecks: false
        }
    },
});
