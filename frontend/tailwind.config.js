/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'gold': '#CBA85F',
        'dark-navy': '#0C0C1C',
        'primary': '#0d1117',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fade-in-up 1s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'bounce': 'bounce 2s infinite',
      },
      backdropBlur: {
        'xs': '2px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      screens: {
        'xs': '475px',
      },
      aspectRatio: {
        'square': '1 / 1',
        'video': '16 / 9',
        'photo': '4 / 3',
      },
      boxShadow: {
        'gold': '0 10px 25px rgba(203, 168, 95, 0.2)',
        'gold-lg': '0 20px 40px rgba(203, 168, 95, 0.3)',
        'inner-light': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-gold': 'linear-gradient(135deg, #CBA85F 0%, #d4af37 100%)',
      },
      blur: {
        'xs': '2px',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0em',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
        'ultra-wide': '0.15em',
      },
    },
  },
  plugins: [
    // Add any additional plugins here
  ],
};