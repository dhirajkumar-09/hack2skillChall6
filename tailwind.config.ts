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
        background: "#090d16",
        surface: "#111827",
        "surface-card": "#182235",
        "surface-border": "#24324a",
        primary: {
          DEFAULT: "#0ea5e9",
          50: "#f0f9ff",
          100: "#e0f2fe",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
        },
        aqi: {
          good: "#10b981",
          moderate: "#f59e0b",
          sensitive: "#f97316",
          unhealthy: "#ef4444",
          veryUnhealthy: "#8b5cf6",
          hazardous: "#881337",
        },
      },
    },
  },
  plugins: [],
};
export default config;
