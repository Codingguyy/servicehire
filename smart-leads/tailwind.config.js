/** @type {import('tailwindcss').Config} */
export default {
  content: ['./frontend/index.html', './frontend/src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0eaff',
          200: '#c7d7fe',
          300: '#a5bafd',
          400: '#8194fb',
          500: '#6270f7',
          600: '#4f52ed',
          700: '#4040d2',
          800: '#3535a9',
          900: '#303085',
          950: '#1e1d52',
        },
        surface: {
          DEFAULT: '#0f0f18',
          card: '#16161f',
          border: '#2a2a3a',
          hover: '#1e1e2e',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
