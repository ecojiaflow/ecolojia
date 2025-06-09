import type { Config } from 'tailwindcss';
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'eco-green': '#38a169',
        'eco-yellow': '#ECC94B',
        'eco-red': '#E53E3E',
      },
    },
  },
  plugins: [],
} satisfies Config;