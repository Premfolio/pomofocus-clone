/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          red: '#ba4949',
          blue: '#38858a',
          green: '#519f50',
          purple: '#7c3aed'
        },
        secondary: {
          red: '#c15c5c',
          blue: '#4a9b9f',
          green: '#6bb36a',
          purple: '#8b5cf6'
        }
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
} 