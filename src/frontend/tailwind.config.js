import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        chart: {
          1: "oklch(var(--chart-1))",
          2: "oklch(var(--chart-2))",
          3: "oklch(var(--chart-3))",
          4: "oklch(var(--chart-4))",
          5: "oklch(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",
          primary: "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        hand: ["var(--font-hand)", "cursive"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0,0,0,0.05)",
        envelope:
          "0 24px 48px -16px oklch(0.08 0.04 18 / 0.8), 0 8px 20px -8px oklch(0.08 0.04 18 / 0.6)",
        seal:
          "0 6px 14px -4px oklch(0.1 0.05 20 / 0.75), inset 0 2px 3px oklch(0.95 0.05 90 / 0.55)",
        letter:
          "0 30px 60px -20px oklch(0.08 0.04 18 / 0.85), 0 4px 12px -4px oklch(0.08 0.04 18 / 0.5)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "seal-pulse": {
          "0%, 100%": {
            transform: "scale(1)",
            filter: "brightness(1)",
          },
          "50%": {
            transform: "scale(1.04)",
            filter: "brightness(1.12)",
          },
        },
        "float-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "fade-rise": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "flap-open": {
          from: { transform: "rotateX(0deg)" },
          to: { transform: "rotateX(-178deg)" },
        },
        "seal-break": {
          "0%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
          "30%": { transform: "scale(1.12) rotate(-5deg)", opacity: "1" },
          "100%": {
            transform: "scale(0.6) rotate(-22deg) translateY(12px)",
            opacity: "0",
          },
        },
        "letter-rise": {
          from: { opacity: "0", transform: "translateY(24%) scale(0.95)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "seal-pulse": "seal-pulse 2.8s ease-in-out infinite",
        "float-soft": "float-soft 5s ease-in-out infinite",
        "fade-rise": "fade-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "flap-open": "flap-open 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "seal-break": "seal-break 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "letter-rise":
          "letter-rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};
