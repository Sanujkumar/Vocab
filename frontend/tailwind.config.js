/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f7f7f8',
          100: '#ededef',
          200: '#d8d8dc',
          300: '#b8b8bf',
          400: '#92929c',
          500: '#75757f',
          600: '#5e5e68',
          700: '#4d4d56',
          800: '#3a3a42',
          900: '#1e1e24',
        },
        sage: {
          50: '#f2f7f4',
          100: '#e0ede5',
          200: '#c3dacc',
          300: '#97c0a8',
          400: '#65a07e',
          500: '#42835f',
          600: '#30694a',
          700: '#27533c',
          800: '#224331',
          900: '#1c3829',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          400: '#fbbf24',
          600: '#d97706',
        },
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          500: '#f43f5e',
          600: '#e11d48',
        },
      },
    },
  },
  plugins: [],
};
