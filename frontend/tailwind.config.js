/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sage': {
          50: '#f4f7f2',
          100: '#e3ebe0',
          200: '#c7d7c1',
          300: '#a3b99a',
          400: '#7f9b73',
          500: '#618354',
          600: '#4c6940',
          700: '#3d5534',
          800: '#2d4026',
          900: '#1d2a18',
        },
        'terracotta': {
          50: '#fbf4ef',
          100: '#f5e3d8',
          200: '#ebc7b2',
          300: '#dea687',
          400: '#d08561',
          500: '#c46d45',
          600: '#b35937',
          700: '#95482e',
          800: '#783b25',
          900: '#5c2d1d',
        },
        'cream': {
          50: '#fefcf9',
          100: '#fcf8f1',
          200: '#f9f0e3',
          300: '#f5e8d4',
          400: '#f0dfc2',
          500: '#e8d0ad',
          600: '#dbbd94',
          700: '#c9a87b',
          800: '#b69362',
          900: '#a37e4b',
        }
      },
      fontFamily: {
        'sans': ['Quicksand', 'Nunito', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
