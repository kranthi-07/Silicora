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
        lab: {
          canvas: "#090B0E",
          surface: {
            0: "#101318",
            1: "#161B22",
            2: "#21262D",
            3: "#30363D",
            highlight: "#2d333b",
          },
          border: {
            subtle: "#21262D",
            default: "#30363D",
            focus: "#58A6FF",
            accent: "rgba(59, 130, 246, 0.4)",
          },
          text: {
            primary: "#F0F6FC",
            secondary: "#8B949E",
            muted: "#6E7681",
            accent: "#58A6FF",
          },
        },
        elec: {
          vcc: "#F85149",
          gnd: "#238636",
          vneg: "#1F6FEB",
          signal: "#E3B341",
          clock: "#A371F7",
        },
        scope: {
          ch1: "#39FF14",
          ch2: "#00F0FF",
          ch3: "#FF007F",
          ch4: "#FFB000",
          grid: "#1A3626",
        },
        status: {
          nominal: "#3FB950",
          warning: "#D29922",
          critical: "#F85149",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "ui-monospace",
          "monospace",
        ],
      },
      boxShadow: {
        hud: "0 10px 30px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.04)",
        glow: "0 0 15px rgba(88, 166, 255, 0.25)",
        glowCyan: "0 0 15px rgba(0, 240, 255, 0.25)",
        glowGreen: "0 0 15px rgba(57, 255, 20, 0.25)",
      },
      animation: {
        pulseSlow: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        scanline: "scanline 8s linear infinite",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
