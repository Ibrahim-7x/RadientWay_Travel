/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep Navy scale
        navy: {
          50: '#f3f6fb',
          100: '#e3e9f3',
          200: '#c2d0e5',
          300: '#93aacf',
          400: '#5c7bb0',
          500: '#3a5a95',
          600: '#2b447a',
          700: '#233763',
          800: '#182647',
          900: '#0f1c37',
          950: '#0b1a2f',
        },
        // Radiant Gold scale
        gold: {
          50: '#fdf9ed',
          100: '#f9efcc',
          200: '#f3dd95',
          300: '#ecc65e',
          400: '#e6b23a',
          500: '#e0a82e',
          600: '#c4831f',
          700: '#a3601c',
          800: '#854b1e',
          900: '#703e1d',
          950: '#40200c',
        },
        cream: '#faf7f0',
        sand: '#f4eee0',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 10px 40px -10px rgba(224, 168, 46, 0.45)',
        'gold-lg': '0 20px 60px -12px rgba(224, 168, 46, 0.5)',
        navy: '0 20px 50px -15px rgba(11, 26, 47, 0.35)',
        card: '0 8px 30px rgba(11, 26, 47, 0.08)',
        'card-hover': '0 24px 60px rgba(11, 26, 47, 0.18)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #e6b23a 0%, #e0a82e 40%, #c4831f 100%)',
        'navy-gradient': 'linear-gradient(135deg, #182647 0%, #0b1a2f 100%)',
        'radiant-glow': 'radial-gradient(circle at 50% 0%, rgba(224,168,46,0.25), transparent 60%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'kenburns': {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.15) translate(-1.5%, -1.5%)' },
        },
        shine: {
          '0%': { transform: 'translateX(-120%) skewX(-20deg)' },
          '100%': { transform: 'translateX(220%) skewX(-20deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease forwards',
        kenburns: 'kenburns 12s ease-out forwards',
        shine: 'shine 1.1s ease',
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin-slow 18s linear infinite',
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [],
}
