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
        background: "#050811",
        surface: {
          DEFAULT: "#0B1224",
          subtle: "#0F1A30",
          elevated: "#152342",
          glass: "rgba(11, 18, 36, 0.75)",
          border: "rgba(255, 255, 255, 0.08)",
        },
        film: {
          hazard: "#F43F5E",
          cleared: "#10B981",
          parallel: "#06B6D4",
          director: "#F59E0B",
          counsel: "#38BDF8",
          bond: "#8B5CF6",
          script: "#34D399",
          location: "#FB923C",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-roboto-mono)", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-hazard": "glowHazard 2s infinite alternate",
        "glow-cleared": "glowCleared 2s infinite alternate",
      },
      keyframes: {
        glowHazard: {
          "0%": { boxShadow: "0 0 5px rgba(244, 63, 94, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(244, 63, 94, 0.6)" },
        },
        glowCleared: {
          "0%": { boxShadow: "0 0 5px rgba(16, 185, 129, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(16, 185, 129, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
