/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'terminal-green': '#00ff00',
        'terminal-dark': '#000000',
      }
    },
  },
  plugins: [],
}