/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'off-white': {
          50: '#FEFEFE',
          100: '#FAF9F6',
          200: '#F7F6F2',
          300: '#F2F1ED',
        },
        'beige': {
          50: '#F5F5DC',
          100: '#F0F0C8',
          200: '#E6E2D3',
          300: '#D4C5A9',
          400: '#C2B280',
          500: '#B5A572',
        },
        'warm-beige': {
          100: '#F8F6F0',
          200: '#F0EDE5',
          300: '#E8E3D8',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        '3d': '0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        '3d-lg': '0 20px 60px -10px rgba(0, 0, 0, 0.15), 0 8px 25px -5px rgba(0, 0, 0, 0.1)',
        'inner-3d': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
    },
  },
  plugins: [],
};


