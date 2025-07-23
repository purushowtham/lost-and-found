// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Configure files to scan for Tailwind classes
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all JS/JSX/TS/TSX files in src
    "./public/index.html",      // Scan index.html
  ],
  theme: {
    extend: {
      // Custom fonts
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Define 'inter' font family
      },
      // Custom colors (optional)
      colors: {
        primary: '#4F46E5', // Example primary color
        secondary: '#6B7280', // Example secondary color
      },
      // Custom animations (optional)
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
      },
    },
  },
  plugins: [], // Add any Tailwind plugins here
}
