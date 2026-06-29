import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#7C3AED",
        success: "#14B8A6",
        danger: "#F43F5E",

        background: "#F8FAFC",
        surface: "#FFFFFF",

        text: "#111827",
        muted: "#6B7280",
      },
    },
  },

  plugins: [],
};

export default config;