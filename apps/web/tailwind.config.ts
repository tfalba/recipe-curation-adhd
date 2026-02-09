import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Manrope", "ui-sans-serif", "system-ui"],
        body: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        bg: "#0B1220",
        surface: "#111827",
        "surface-2": "#0F172A",
        border: "#1F2937",
        text: "#F8FAFC",
        muted: "#94A3B8",

        primary: "#2563EB",
        accent: "#A3E635",
        violet: "#7C3AED",

        success: "#22C55E",
        warning: "#FBBF24",
        danger: "#F43F5E",
        info: "#38BDF8",
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px",
        "3xl": "24px",
      },
      boxShadow: {
        panel: "0 12px 30px rgba(0,0,0,0.45)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.06)",
        focus: "0 0 0 3px rgba(37,99,235,0.55)",
        glow: "0 0 24px rgba(163,230,53,0.25)",
      },
      spacing: {
        tap: "44px",
      },
      transitionTimingFunction: {
        snappy: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
      transitionDuration: {
        quick: "140ms",
        normal: "220ms",
      },
    },
  },
  plugins: [],
} satisfies Config;
