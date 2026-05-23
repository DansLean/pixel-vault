import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ["'Press Start 2P'", "monospace"],
        body: ["Nunito", "sans-serif"],
      },
      colors: {
        "bv-bg": "#f2d9a0",
        "bv-card": "#c8832a",
        "bv-card-dark": "#7a4f10",
        "bv-navbar": "#e8c880",
        "bv-search": "#b8d8f0",
        "bv-filter": "#88c8e8",
        "bv-text": "#2a1500",
        "bv-text-secondary": "#5a3010",
        "bv-accent": "#ff6b00",
        "bv-star": "#ffd700",
        "bv-heart": "#e84040",
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        card: "0 4px 0 #7a4f10",
        "card-hover": "0 6px 0 #5a3010",
      },
    },
  },
  plugins: [],
};

export default config;