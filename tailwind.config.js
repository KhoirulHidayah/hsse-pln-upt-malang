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
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            // Warna custom sesuai logo HSSE PLN
            colors: {
                'hsse-teal': '#0891b2', // Warna biru teal dari logo
                'hsse-cyan': '#0e7490', // Alternatif cyan gelap
                'hsse-lime': '#84cc16', // Warna hijau lime dari logo
                'hsse-green': '#65a30d', // Alternatif hijau
            },
            // Animasi shine
            keyframes: {
                shine: {
                    '0%': { transform: 'translateX(-100%) skewX(-12deg)' },
                    '100%': { transform: 'translateX(200%) skewX(-12deg)' },
                }
            },
            animation: {
                shine: 'shine 2s infinite',
            }
        },
    },

    darkMode: false, // matikan dark mode sepenuhnya

    plugins: [forms],
};