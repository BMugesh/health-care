/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#bbd0ff',
          50: '#f0f5ff',
          100: '#e1eaff',
          200: '#bbd0ff', // Main
          300: '#90b0ff',
          400: '#608aff',
          500: '#3b6bf5',
          600: '#2047d4',
          700: '#1836aa',
          800: '#152d8a',
          900: '#16286e',
        },
        secondary: {
          DEFAULT: '#c8b6ff',
          50: '#f5f2ff',
          100: '#ebe6ff',
          200: '#c8b6ff', // Main
          300: '#a585ff',
          400: '#8454ff',
          500: '#692df5',
          600: '#561bd4',
          700: '#4615aa',
          800: '#3b158a',
          900: '#32156e',
        },
      }
    },
  },
  plugins: [],
};
