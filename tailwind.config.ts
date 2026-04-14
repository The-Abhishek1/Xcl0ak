import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef8ff",
          100: "#d8efff",
          200: "#b9e3ff",
          300: "#89d3ff",
          400: "#52b8ff",
          500: "#2a97ff",
          600: "#1479f6",
          700: "#0d62e3",
          800: "#114fb8",
          900: "#144590",
        },
        danger: { DEFAULT: "#ef4444", muted: "rgba(239,68,68,0.08)" },
        warn: { DEFAULT: "#f59e0b", muted: "rgba(245,158,11,0.08)" },
        success: { DEFAULT: "#22c55e", muted: "rgba(34,197,94,0.08)" },
        info: { DEFAULT: "#06b6d4", muted: "rgba(6,182,212,0.08)" },
        // Light mode surfaces
        surface: {
          DEFAULT: "#ffffff",
          secondary: "#f8fafc",
          tertiary: "#f1f5f9",
          border: "#e2e8f0",
          "border-hover": "#cbd5e1",
          muted: "#94a3b8",
        },
        // Dark mode surfaces
        dark: {
          bg: "#0f1117",
          surface: "#181b25",
          card: "#1e2130",
          elevated: "#262a3a",
          border: "#2e3348",
          "border-hover": "#3d4260",
          text: "#e2e5ef",
          "text-secondary": "#8b90a8",
          muted: "#505570",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', "system-ui", "sans-serif"],
        mono: ['"Fira Code"', '"JetBrains Mono"', "monospace"],
        display: ['"Cal Sans"', '"Plus Jakarta Sans"', "sans-serif"],
      },
      borderRadius: { xl: "12px", "2xl": "16px", "3xl": "20px" },
      boxShadow: {
        glass: "0 4px 30px rgba(0,0,0,0.04)",
        "glass-dark": "0 4px 30px rgba(0,0,0,0.3)",
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.08)",
        "card-dark": "0 2px 8px rgba(0,0,0,0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease forwards",
        "slide-up": "slideUp 0.35s ease forwards",
        "slide-right": "slideRight 0.3s ease forwards",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0", transform: "translateY(6px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideUp: { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideRight: { from: { opacity: "0", transform: "translateX(16px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        pulseDot: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.3" } },
      },
    },
  },
  plugins: [],
};
export default config;
