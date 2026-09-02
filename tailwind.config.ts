import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0C0C0E",
        surface: {
          DEFAULT: "#121214",
          subtle: "#18181B",
          elevated: "#222226",
          border: "rgba(255, 255, 255, 0.08)",
          hover: "#27272A",
        },
        accent: {
          DEFAULT: "#3B82F6",
          hover: "#2563EB",
          emerald: "#10B981",
          rose: "#F43F5E",
          amber: "#F59E0B",
          indigo: "#6366F1",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-roboto-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
