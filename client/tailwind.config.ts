/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      borderWidth: {
        "3": "3px",
      },
      animation: {
        "spin-slow": "spin 2s linear infinite",
      },
    },
  },

  plugins: [],
};