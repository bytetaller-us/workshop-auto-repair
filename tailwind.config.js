/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        njblue: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        taller: {
          bg: '#f8fafc',
          card: '#ffffff',
          dark: '#0f172a',
          accent: '#0284c7',
          success: '#16a34a',
          warning: '#eab308',
          danger: '#dc2626',
        }
      },
    },
  },
  plugins: [],
};
