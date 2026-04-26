import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0f2742',
          blue: '#14539a',
          mist: '#eef6ff',
          line: '#dbe7f3'
        }
      },
      boxShadow: {
        card: '0 8px 30px rgba(15, 39, 66, 0.08)'
      }
    }
  },
  plugins: []
};
export default config;
