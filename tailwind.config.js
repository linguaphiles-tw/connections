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
      },
      animation: {
        'horizontal-shake': 'horizontal-shake 0.2s ease-in-out infinite',
        'guess-animation': 'guess-animation 0.4s ease-in-out',
      },
    },
  },
  plugins: [],
};
