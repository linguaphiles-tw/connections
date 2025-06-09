// modified from https://github.com/srefsland/nyt-connections-clone
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        'horizontal-shake': {
          '0%, 50%, 100%': {
            transform: 'translateX(0)',
          },
          '25%': {
            transform: 'translateX(-5px)',
          },
          '75%': {
            transform: 'translateX(5px)',
          },
        },
        'guess-animation': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-0.5rem)' },
        },
        'fade-out': {
          '0%': {
            opacity: 1,
            transform: 'scale(1)',
          },
          '50%': {
            opacity: 0.5,
            transform: 'scale(1.2)',
          },
          '100%': {
            opacity: 0,
            transform: 'scale(0.8)',
          },
        },
        pulse: {
          '0%': {
            transform: 'scaleY(1) scaleX(1)',
          },
          '40%': {
            transform: 'scaleY(1.2) scaleX(1.2)',
          },
          '70%': {
            transform: 'scaleY(1.2) scaleX(1.2)',
          },
          '100%': {
            transform: 'scaleY(1) scaleX(1)', zIndex: 4,
          },
        },
      },
      animation: {
        'horizontal-shake': 'horizontal-shake 0.2s ease-in-out infinite',
        'guess-animation': 'guess-animation 0.2s ease-in-out',
        'fade-out': 'fade-out 0.8s ease-out',
        pulse: 'pulse 0.3s linear 1',
      },
    },
  },
  plugins: [],
};
