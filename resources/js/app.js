// resources/js/app.js
// Boots the Inertia React application.
// Exists so Laravel routes can render React pages through Inertia.
// RELATED FILES: resources/views/app.blade.php, resources/js/Pages/Dashboard.jsx, vite.config.js
import './bootstrap';
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

createInertiaApp({
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        createRoot(el).render(createElement(App, props));
    },
});
