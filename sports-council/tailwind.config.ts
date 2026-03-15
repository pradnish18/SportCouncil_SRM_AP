import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        surface2: "var(--surface2)",
        muted: "var(--muted)",
        card: "var(--card)",
        border: "var(--border)",
        brand: {
          srm: "#494623",
          srm_light: "#6b6533",
          blue: "#3b82f6",
          green: "#10b981",
          amber: "#f59e0b",
          purple: "#e879f9",
          indigo: "#6366f1",
          violet: "#8b5cf6",
        },
        edit: "#fbbf24",
      },
      fontFamily: {
        syne: ["var(--font-syne)"],
        outfit: ["var(--font-outfit)"],
      },
    },
  },
  plugins: [],
};
export default config;

