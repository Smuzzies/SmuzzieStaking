/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ff6b00',
          hover: '#ff8533',
        },
        dark: {
          DEFAULT: '#1a1a1a',
          card: '#2a2a2a',
          border: '#333333',
        },
      },
      maxWidth: {
        container: '1400px',
      },
    },
  },
  plugins: [],
} 