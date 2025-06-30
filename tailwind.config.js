/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter', 
          'ui-sans-serif', 
          'system-ui', 
          'sans-serif'
        ],
        serif: [
          'Newsreader',
          'ui-serif', 
          'Georgia', 
          'serif'
        ],
      },
      colors: {
        indigo: {
          950: '#1a1238',
        },
      },
      animation: {
        'slow-spin': 'spin 15s linear infinite',
      },
    },
  },
  plugins: [],
};