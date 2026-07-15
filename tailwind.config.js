import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#ecf8f2',
                    200: '#a9dfc4',
                    300: '#74c9a0',
                    400: '#45b381',
                    500: '#22a06b',
                    600: '#178a5a',
                    700: '#127049',
                    800: '#0f5a3c',
                },
                expense: '#e5484d',
            },
            height: {
                13: '3.25rem',
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms],
};
