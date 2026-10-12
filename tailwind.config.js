/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          950: '#050A18', // Deepest Abyss
          900: '#070D1E', // Primary background (deep navy)
          850: '#0C162E', // Secondary background
          800: '#101C38', // Dark blue cards
          750: '#142449', // Card hover / border
          700: '#1C2541', // Elevated surface
          600: '#2A3F70', // Subtle blue-grey borders
          500: '#0077B6', // Ocean Blue
          400: '#0096C7', // Bright Ocean
          300: '#48CAE4', // Soft Cyan
          200: '#90E0EF', // Pale Cyan
          100: '#CAF0F8', // Whisper Cyan
          50: '#F0F9FF',
        },
        cyan: {
          neon: '#00F0FF',
          glow: '#00E5FF',
        },
        lavender: {
          400: '#B5A6FF',
          500: '#9D8DF1',
          600: '#8471ED',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'ocean-glow': '0 0 25px -5px rgba(0, 240, 255, 0.25)',
        'blue-glow': '0 0 30px -5px rgba(58, 134, 255, 0.3)',
        'lavender-glow': '0 0 25px -5px rgba(181, 166, 255, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
