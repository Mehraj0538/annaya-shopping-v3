import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'royal-purple':  '#5A2D82',
        'deep-purple':   '#3A1B5D',
        'lavender-bg':   '#F6F0FB',
        'luxury-border': '#E9DDF5',
        'muted-text':    '#7A6C8F',
        'primary-text':  '#1C0F2E',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans:  ['var(--font-sans)',  'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
