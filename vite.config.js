// vite.config.js
// Configures Vite for Laravel assets, React, and Tailwind CSS.
// Exists so Laravel can compile frontend resources for the Inertia React app.
// RELATED FILES: resources/js/app.js, resources/css/app.css, package.json
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
