import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6B1C2A',
          dark: '#4A141D',
          light: '#8B2A3A',
        },
        secondary: {
          DEFAULT: '#D4AF37',
          dark: '#B8941F',
          light: '#E5C158',
        },
        accent: {
          DEFAULT: '#222222',
          light: '#444444',
        },
      },
    },
  },
  plugins: [],
}
export default config


