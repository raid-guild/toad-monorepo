/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Base colors
                'very-dark-green': '#132A13',
                'dark-green': '#31572C',
                'medium-green': '#4F772D',
                'light-green': '#90A955',
                'very-light-green': '#ECF39E',

                // Semantic colors
                primary: {
                    DEFAULT: '#31572C',
                    light: '#4F772D',
                    dark: '#132A13',
                },
                secondary: {
                    DEFAULT: '#90A955',
                    light: '#ECF39E',
                    dark: '#4F772D',
                },
                accent: {
                    DEFAULT: '#90A955',
                    light: '#ECF39E',
                    dark: '#4F772D',
                },
                background: {
                    DEFAULT: '#F0F7F4',
                    light: '#F0F7F4',
                    dark: '#0A1929',
                },
                surface: {
                    DEFAULT: '#FFFFFF',
                    light: '#FFFFFF',
                    dark: '#1A2027',
                },
                text: {
                    primary: {
                        DEFAULT: '#31572C',
                        light: '#31572C',
                        dark: '#ECF39E',
                    },
                    secondary: {
                        DEFAULT: '#4F772D',
                        light: '#4F772D',
                        dark: '#90A955',
                    },
                    body: {
                        DEFAULT: '#1F2937',
                        light: '#1F2937',
                        dark: '#F9FAFB',
                    },
                },
            },
            boxShadow: {
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'card-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
            },
            borderRadius: {
                'card': '0.75rem',
            },
            transitionDuration: {
                '200': '200ms',
                '300': '300ms',
            },
        },
    },
    plugins: [],
} 