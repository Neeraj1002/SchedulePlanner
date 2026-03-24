/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Your specific Orbit palette
        slate: {
          950: '#0B0E25', // That deep navy from your screenshot
        },
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px', // For the Hero cards
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'neon-indigo': '0 0 20px rgba(79, 70, 229, 0.4)',
        'neon-rose': '0 0 20px rgba(244, 63, 94, 0.4)',
        'glass': '0 20px 50px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'), // Essential for the clean horizontal Orbit scroll
  ],
}