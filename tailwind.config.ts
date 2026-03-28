import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        slate: '#1a1a1a',
        mist: '#f5f5f5'
      }
    }
  },
  plugins: []
};

export default config;
