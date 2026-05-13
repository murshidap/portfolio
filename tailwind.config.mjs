/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)"
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)"
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)"
        }
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 30px rgba(88, 107, 255, 0.35)",
        panel: "0 24px 80px rgba(7, 10, 30, 0.5)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at 50% 25%, rgba(83, 110, 255, 0.3), transparent 28%), radial-gradient(circle at 78% 85%, rgba(159, 91, 255, 0.22), transparent 26%), linear-gradient(120deg, rgba(8, 12, 34, 0.94), rgba(6, 8, 24, 0.98))"
      }
    }
  },
  plugins: []
};
