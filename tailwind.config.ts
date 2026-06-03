import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        pitch: {
          50: "#f1f8f1",
          100: "#dcefdc",
          600: "#217a43",
          700: "#176035",
          900: "#102f22"
        },
        line: "#d9e2dc"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(16, 47, 34, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
