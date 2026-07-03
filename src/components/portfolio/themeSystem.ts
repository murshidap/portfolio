import type { CSSProperties } from "react";

export type PortfolioTheme = {
  id: string;
  colors: [string, string, string, string, string];
  accentText: string;
  navAccent: string;
  buttonAccent: string;
};

const THEME_TRANSITION_MS = 820;

export const PORTFOLIO_THEMES: PortfolioTheme[] = [
  {
    id: "midnight-cyan",
    colors: ["#020617", "#0F172A", "#1E293B", "#0EA5E9", "#67E8F9"],
    accentText: "#67E8F9",
    navAccent: "#38BDF8",
    buttonAccent: "#0EA5E9"
  },
  {
    id: "deep-purple-indigo",
    colors: ["#050816", "#1E1B4B", "#312E81", "#4F46E5", "#A78BFA"],
    accentText: "#A78BFA",
    navAccent: "#7C6CFF",
    buttonAccent: "#5B4CF4"
  },
  {
    id: "black-crimson",
    colors: ["#000000", "#1A0000", "#450A0A", "#991B1B", "#EF4444"],
    accentText: "#F87171",
    navAccent: "#EF4444",
    buttonAccent: "#B91C1C"
  },
  {
    id: "emerald-teal",
    colors: ["#020617", "#052E2B", "#115E59", "#14B8A6", "#5EEAD4"],
    accentText: "#5EEAD4",
    navAccent: "#2DD4BF",
    buttonAccent: "#14B8A6"
  },
  {
    id: "graphite-silver",
    colors: ["#020202", "#111827", "#374151", "#64748B", "#CBD5E1"],
    accentText: "#CBD5E1",
    navAccent: "#94A3B8",
    buttonAccent: "#64748B"
  },
  {
    id: "magenta-violet",
    colors: ["#050505", "#1E0033", "#4C1D95", "#7C3AED", "#E879F9"],
    accentText: "#E879F9",
    navAccent: "#A855F7",
    buttonAccent: "#7C3AED"
  },
  {
    id: "royal-default",
    colors: ["#FFFFFF", "#FAFAFA", "#F4F4F5", "#111111", "#525252"],
    accentText: "#525252",
    navAccent: "#111111",
    buttonAccent: "#111111"
  }
];

export const DEFAULT_THEME_INDEX = PORTFOLIO_THEMES.length - 1;

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3 ? normalized.split("").map((char) => char + char).join("") : normalized;

  const parsed = Number.parseInt(value, 16);
  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255
  };
}

function withAlpha(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getThemeStyle(theme: PortfolioTheme): CSSProperties {
  const [base, surface, elevated, accent, accentSoft] = theme.colors;

  return {
    ["--theme-base" as string]: base,
    ["--theme-surface" as string]: surface,
    ["--theme-elevated" as string]: elevated,
    ["--theme-accent" as string]: accent,
    ["--theme-accent-soft" as string]: accentSoft,
    ["--theme-nav-accent" as string]: theme.navAccent,
    ["--theme-button-accent" as string]: theme.buttonAccent,
    ["--theme-accent-text" as string]: theme.accentText,
    ["--theme-card-bg" as string]: "#FFFFFF",
    ["--theme-card-border" as string]: "#D4D4D8",
    ["--theme-glass-bg" as string]: "#FFFFFF",
    ["--theme-glass-border" as string]: "#D4D4D8",
    ["--theme-panel-shadow" as string]: "none",
    ["--theme-glow-shadow" as string]: "none",
    ["--theme-button-gradient" as string]: "#111111",
    ["--theme-button-border" as string]: "#111111",
    ["--theme-muted-text" as string]: withAlpha("#111111", 0.66),
    ["--theme-soft-copy" as string]: withAlpha("#111111", 0.56),
    ["--theme-faint-copy" as string]: withAlpha("#111111", 0.58),
    ["--theme-line" as string]: withAlpha("#111111", 0.34),
    ["--theme-line-strong" as string]: withAlpha("#111111", 0.72),
    ["--theme-node" as string]: "#111111",
    ["--theme-node-glow" as string]: withAlpha("#111111", 0.18),
    ["--theme-node-active-glow" as string]: withAlpha("#111111", 0.26),
    ["--theme-tooltip-bg" as string]: "#FFFFFF",
    ["--theme-tooltip-border" as string]: "#D4D4D8",
    ["--theme-transition-duration" as string]: `${THEME_TRANSITION_MS}ms`
  };
}
