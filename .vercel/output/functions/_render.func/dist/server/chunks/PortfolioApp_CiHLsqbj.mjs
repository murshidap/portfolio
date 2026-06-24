import { jsx, jsxs } from 'react/jsx-runtime';
import { useReducedMotion, motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Mail, Share2 } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { c as cn, B as Button, C as Card } from './BaseLayout_d7LB0cf-.mjs';

function ConstellationWidget({ activeIndex, onAdvance, themes }) {
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const activeTheme = themes[activeIndex];
  const accent = activeTheme.colors[3];
  const accentSoft = activeTheme.colors[4];
  const startX = 2;
  const endX = 98;
  const span = endX - startX;
  return /* @__PURE__ */ jsx(
    motion.button,
    {
      animate: prefersReducedMotion ? { opacity: isHovered ? 0.94 : 0.56 } : {
        opacity: isHovered ? 0.94 : 0.56,
        y: [0, -2, 0]
      },
      "aria-label": "Cycle portfolio color theme",
      className: "pointer-events-auto absolute left-0 top-[calc(100%+0.55rem)] z-20 h-9 w-full appearance-none bg-transparent p-0 outline-none md:top-[calc(100%+0.7rem)]",
      onBlur: () => setIsHovered(false),
      onClick: onAdvance,
      onFocus: () => setIsHovered(true),
      onHoverEnd: () => setIsHovered(false),
      onHoverStart: () => setIsHovered(true),
      style: {
        filter: `drop-shadow(0 0 18px ${accent}22)`
      },
      transition: {
        duration: prefersReducedMotion ? 0.16 : 4.8,
        ease: "easeInOut",
        repeat: prefersReducedMotion ? 0 : Number.POSITIVE_INFINITY
      },
      type: "button",
      whileTap: prefersReducedMotion ? void 0 : { scale: 0.985 },
      children: /* @__PURE__ */ jsxs("div", { "aria-hidden": "true", className: "relative h-full w-full", children: [
        /* @__PURE__ */ jsx(
          motion.div,
          {
            animate: {
              opacity: isHovered ? 0.72 : 0.42
            },
            className: "absolute top-1/2 h-px -translate-y-1/2 rounded-full",
            style: {
              left: `${startX}%`,
              right: `${100 - endX}%`,
              backgroundColor: accentSoft,
              filter: `drop-shadow(0 0 8px ${accentSoft}55)`
            },
            transition: { duration: prefersReducedMotion ? 0.16 : 0.4, ease: "easeOut" }
          }
        ),
        themes.map((theme, index) => {
          const x = startX + span * index / (themes.length - 1);
          const active = index === activeIndex;
          return /* @__PURE__ */ jsxs(
            motion.div,
            {
              animate: prefersReducedMotion ? { opacity: active ? 1 : isHovered ? 0.72 : 0.5, scale: 1 } : {
                opacity: active ? [0.88, 1, 0.92] : isHovered ? [0.52, 0.74, 0.58] : [0.34, 0.5, 0.38],
                scale: active ? [1, 1.08, 1] : [1, 1.03, 1]
              },
              className: "absolute top-1/2",
              style: {
                left: `${x}%`,
                transform: "translate(-50%, -50%)",
                transformOrigin: "center"
              },
              transition: {
                duration: prefersReducedMotion ? 0.16 : active ? 1.35 : 2.1,
                ease: "easeInOut",
                repeat: prefersReducedMotion ? 0 : Number.POSITIVE_INFINITY,
                delay: prefersReducedMotion ? 0 : index * 0.08
              },
              children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
                    style: {
                      backgroundColor: active ? accent : accentSoft,
                      opacity: active ? 0.24 : isHovered ? 0.1 : 0.05
                    }
                  }
                ),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "absolute left-1/2 top-1/2 h-[0.34rem] w-[0.34rem] -translate-x-1/2 -translate-y-1/2 rounded-full",
                    style: { backgroundColor: "var(--theme-node)" }
                  }
                ),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "absolute left-1/2 top-1/2 h-[0.34rem] w-[0.34rem] -translate-x-1/2 -translate-y-1/2 rounded-full",
                    style: {
                      backgroundColor: active ? accent : accentSoft,
                      opacity: active ? 0.92 : 0.68,
                      filter: `drop-shadow(0 0 8px ${active ? "var(--theme-node-active-glow)" : "var(--theme-node-glow)"})`
                    }
                  }
                )
              ]
            },
            theme.id
          );
        })
      ] })
    }
  );
}

const THEME_TRANSITION_MS = 820;
const PORTFOLIO_THEMES = [
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
    colors: ["#030612", "#070B1F", "#11183B", "#4E77FF", "#8D73FF"],
    accentText: "#B7C1FF",
    navAccent: "#8D73FF",
    buttonAccent: "#6671FF"
  }
];
const DEFAULT_THEME_INDEX = PORTFOLIO_THEMES.length - 1;
function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3 ? normalized.split("").map((char) => char + char).join("") : normalized;
  const parsed = Number.parseInt(value, 16);
  return {
    r: parsed >> 16 & 255,
    g: parsed >> 8 & 255,
    b: parsed & 255
  };
}
function withAlpha(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function getThemeStyle(theme) {
  const [base, surface, elevated, accent, accentSoft] = theme.colors;
  return {
    ["--theme-base"]: base,
    ["--theme-surface"]: surface,
    ["--theme-elevated"]: elevated,
    ["--theme-accent"]: accent,
    ["--theme-accent-soft"]: accentSoft,
    ["--theme-nav-accent"]: theme.navAccent,
    ["--theme-button-accent"]: theme.buttonAccent,
    ["--theme-accent-text"]: theme.accentText,
    ["--theme-card-bg"]: withAlpha("#FFFFFF", 0.04),
    ["--theme-card-border"]: withAlpha(accentSoft, 0.16),
    ["--theme-glass-bg"]: withAlpha("#FFFFFF", 0.05),
    ["--theme-glass-border"]: withAlpha("#FFFFFF", 0.1),
    ["--theme-panel-shadow"]: `0 24px 80px ${withAlpha(base, 0.52)}`,
    ["--theme-glow-shadow"]: `0 0 30px ${withAlpha(accent, 0.35)}`,
    ["--theme-button-gradient"]: `linear-gradient(90deg, ${withAlpha(accent, 0.95)}, ${withAlpha(accentSoft, 0.42)})`,
    ["--theme-button-border"]: withAlpha(accentSoft, 0.18),
    ["--theme-muted-text"]: withAlpha("#C9D2E8", 0.72),
    ["--theme-soft-copy"]: withAlpha("#B3BED4", 0.56),
    ["--theme-faint-copy"]: withAlpha("#BAC4DC", 0.58),
    ["--theme-line"]: withAlpha(accentSoft, 0.34),
    ["--theme-line-strong"]: withAlpha(accentSoft, 0.7),
    ["--theme-node"]: "#F3F7FF",
    ["--theme-node-glow"]: withAlpha(accentSoft, 0.92),
    ["--theme-node-active-glow"]: withAlpha(accent, 1),
    ["--theme-tooltip-bg"]: withAlpha(surface, 0.86),
    ["--theme-tooltip-border"]: withAlpha(accentSoft, 0.22),
    ["--theme-transition-duration"]: `${THEME_TRANSITION_MS}ms`
  };
}

const views = [
  { key: "home", label: "Home" },
  { key: "skills", label: "Skills" },
  { key: "projects", label: "Projects" },
  { key: "experience", label: "Experience" },
  { key: "certificates", label: "Certificates" },
  { key: "education", label: "Education" }
];
function getViewHref(view) {
  if (view === "home") {
    return "/";
  }
  if (view === "certificates") {
    return "/certifications";
  }
  return `/${view}`;
}
function GithubIcon({ className = "h-5 w-5" }) {
  return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className: className + " fill-none stroke-current stroke-[1.8]", children: /* @__PURE__ */ jsx("path", { d: "M9 19c-4.5 1.4-4.5-2.5-6-3m12 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 18 4.77 5.07 5.07 0 0 0 17.91 1S16.73.65 14 2.48a13.38 13.38 0 0 0-6 0C5.27.65 4.09 1 4.09 1A5.07 5.07 0 0 0 4 4.77 5.44 5.44 0 0 0 2.5 8.52c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 8 18.13V22" }) });
}
function LinkedInIcon({ className = "h-5 w-5" }) {
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", className: className + " fill-none stroke-current stroke-[1.8]", children: [
    /* @__PURE__ */ jsx("path", { d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 1 0-4 0v7h-4v-12h4v2a4 4 0 0 1 2-3Z" }),
    /* @__PURE__ */ jsx("rect", { x: "2", y: "9", width: "4", height: "12", rx: "1" }),
    /* @__PURE__ */ jsx("circle", { cx: "4", cy: "4", r: "2" })
  ] });
}
function SocialLinks({ content, className = "" }) {
  const items = [
    { href: content.github_url, label: "GitHub", icon: /* @__PURE__ */ jsx(GithubIcon, {}) },
    { href: content.linkedin_url, label: "LinkedIn", icon: /* @__PURE__ */ jsx(LinkedInIcon, {}) },
    { href: `mailto:${content.email}`, label: "Email", icon: /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5" }) }
  ];
  return /* @__PURE__ */ jsxs("div", { className, children: [
    items.map((item) => /* @__PURE__ */ jsx(
      "a",
      {
        "aria-label": item.label,
        className: "text-white/65 transition hover:text-white",
        href: item.href,
        rel: "noreferrer",
        target: item.href.startsWith("http") ? "_blank" : void 0,
        children: item.icon
      },
      item.label
    )),
    /* @__PURE__ */ jsx(
      "button",
      {
        "aria-label": "Copy website address",
        className: "text-white/65 transition hover:text-white",
        onClick: async () => {
          if (typeof window === "undefined") {
            return;
          }
          try {
            await navigator.clipboard.writeText(window.location.href);
          } catch {
          }
        },
        type: "button",
        children: /* @__PURE__ */ jsx(Share2, { className: "h-5 w-5" })
      }
    )
  ] });
}
const skillSlots = [
  { offset: -2, left: "-4%", top: "72%", scale: 0.52, opacity: 0.26, blur: 6, zIndex: 0 },
  { offset: -1, left: "24%", top: "48%", scale: 0.72, opacity: 0.58, blur: 3, zIndex: 1 },
  { offset: 0, left: "50%", top: "30%", scale: 1, opacity: 1, blur: 0, zIndex: 3 },
  { offset: 1, left: "76%", top: "48%", scale: 0.72, opacity: 0.58, blur: 3, zIndex: 1 },
  { offset: 2, left: "104%", top: "72%", scale: 0.52, opacity: 0.26, blur: 6, zIndex: 0 }
];
const skillFlowTransition = {
  duration: 0.92,
  ease: [0.16, 1, 0.3, 1]
};
function getSkillInitials(skill) {
  const words = skill.replace(/[^a-z0-9]+/gi, " ").trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  return (words[0] || skill).slice(0, 2).toUpperCase();
}
function SkillMark({ skill }) {
  const normalizedSkill = skill.toLowerCase();
  if (normalizedSkill.includes("react")) {
    return /* @__PURE__ */ jsxs("svg", { "aria-hidden": "true", className: "h-[58%] w-[58%]", viewBox: "0 0 100 100", children: [
      /* @__PURE__ */ jsx("circle", { cx: "50", cy: "50", r: "8", fill: "currentColor" }),
      /* @__PURE__ */ jsx("ellipse", { cx: "50", cy: "50", fill: "none", rx: "38", ry: "15", stroke: "currentColor", strokeWidth: "7" }),
      /* @__PURE__ */ jsx(
        "ellipse",
        {
          cx: "50",
          cy: "50",
          fill: "none",
          rx: "38",
          ry: "15",
          stroke: "currentColor",
          strokeWidth: "7",
          transform: "rotate(60 50 50)"
        }
      ),
      /* @__PURE__ */ jsx(
        "ellipse",
        {
          cx: "50",
          cy: "50",
          fill: "none",
          rx: "38",
          ry: "15",
          stroke: "currentColor",
          strokeWidth: "7",
          transform: "rotate(120 50 50)"
        }
      )
    ] });
  }
  if (normalizedSkill.includes("astro")) {
    return /* @__PURE__ */ jsxs("svg", { "aria-hidden": "true", className: "h-[62%] w-[62%]", viewBox: "0 0 100 100", children: [
      /* @__PURE__ */ jsx("path", { d: "M50 8 88 78H12L50 8Z", fill: "currentColor", opacity: "0.95" }),
      /* @__PURE__ */ jsx("path", { d: "M38 80c5 10 19 10 24 0 2 10 8 15 18 15-8 8-22 8-30 1-8 7-22 7-30-1 10 0 16-5 18-15Z", fill: "currentColor" }),
      /* @__PURE__ */ jsx("path", { d: "M50 30 63 62H37L50 30Z", fill: "rgba(255,255,255,0.32)" })
    ] });
  }
  if (normalizedSkill.includes("tailwind")) {
    return /* @__PURE__ */ jsxs("svg", { "aria-hidden": "true", className: "h-[58%] w-[58%]", viewBox: "0 0 100 100", children: [
      /* @__PURE__ */ jsx(
        "path",
        {
          d: "M24 43c7-20 20-30 38-30 11 0 19 5 25 14-6-4-13-5-21-2-8 3-13 9-17 19-7 20-20 30-38 30-11 0-19-5-25-14 6 4 13 5 21 2 8-3 13-9 17-19Z",
          fill: "currentColor"
        }
      ),
      /* @__PURE__ */ jsx(
        "path",
        {
          d: "M38 61c5-14 15-21 29-21 8 0 15 4 19 11-5-3-10-4-16-2-6 2-10 7-13 14-5 14-15 21-29 21-8 0-15-4-19-11 5 3 10 4 16 2 6-2 10-7 13-14Z",
          fill: "rgba(255,255,255,0.34)"
        }
      )
    ] });
  }
  if (normalizedSkill.includes("supabase")) {
    return /* @__PURE__ */ jsxs("svg", { "aria-hidden": "true", className: "h-[60%] w-[60%]", viewBox: "0 0 100 100", children: [
      /* @__PURE__ */ jsx("path", { d: "M55 7 18 56h31l-4 37 37-50H51l4-36Z", fill: "currentColor" }),
      /* @__PURE__ */ jsx("path", { d: "M51 43h31L45 93l4-37H18L55 7l-4 36Z", fill: "rgba(255,255,255,0.26)" })
    ] });
  }
  return /* @__PURE__ */ jsx("span", { className: "font-display text-[clamp(2rem,5vw,4rem)] font-bold", children: getSkillInitials(skill) });
}
function SkillTile({ active, skill }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "group relative grid aspect-square w-[clamp(5.4rem,15vw,9rem)] place-items-center overflow-hidden rounded-[1.4rem] border backdrop-blur-2xl",
        active ? "border-white/24 bg-white/[0.13] shadow-[0_26px_90px_rgba(0,0,0,0.42)]" : "border-white/10 bg-white/[0.055]"
      ),
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-[10%] rounded-full border border-white/10" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_48%_28%,rgba(255,255,255,0.22),transparent_34%),linear-gradient(135deg,color-mix(in_srgb,var(--theme-accent)_72%,transparent),color-mix(in_srgb,var(--theme-accent-soft)_48%,transparent))]" }),
        /* @__PURE__ */ jsx("div", { className: "relative z-10 grid h-full w-full place-items-center text-white drop-shadow-[0_12px_28px_rgba(0,0,0,0.34)]", children: /* @__PURE__ */ jsx(SkillMark, { skill }) })
      ]
    }
  );
}
function SkillsShowcase({ skills }) {
  const skillItems = useMemo(() => skills.map((skill) => skill.trim()).filter(Boolean), [skills]);
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);
  const activeSkill = skillItems.length > 0 ? skillItems[(activeSkillIndex % skillItems.length + skillItems.length) % skillItems.length] : "";
  useEffect(() => {
    if (skillItems.length === 0) {
      return;
    }
    setActiveSkillIndex(0);
  }, [skillItems.length]);
  useEffect(() => {
    if (skillItems.length <= 1) {
      return;
    }
    const intervalId = window.setInterval(() => {
      setActiveSkillIndex((currentIndex) => currentIndex + 1);
    }, 2600);
    return () => window.clearInterval(intervalId);
  }, [skillItems.length]);
  if (skillItems.length === 0) {
    return null;
  }
  const visibleSkillPlacements = skillSlots.filter((slot) => skillItems.length > 1 || slot.offset === 0).map((slot) => {
    const virtualIndex = activeSkillIndex + slot.offset;
    const skillIndex = (virtualIndex % skillItems.length + skillItems.length) % skillItems.length;
    const skill = skillItems[skillIndex];
    return { skill, slot, virtualIndex };
  });
  return /* @__PURE__ */ jsxs("section", { className: "mx-auto flex min-h-[72vh] w-full max-w-[1120px] flex-col justify-center overflow-hidden py-8", children: [
    /* @__PURE__ */ jsx("div", { className: "theme-active-bar mb-7 h-px w-16" }),
    /* @__PURE__ */ jsxs("div", { className: "relative min-h-[430px] overflow-hidden sm:min-h-[500px]", children: [
      /* @__PURE__ */ jsx(AnimatePresence, { initial: false, children: visibleSkillPlacements.map(({ skill, slot, virtualIndex }) => {
        const active = slot.offset === 0;
        return /* @__PURE__ */ jsx(
          motion.button,
          {
            animate: {
              filter: `blur(${slot.blur}px)`,
              left: slot.left,
              opacity: slot.opacity,
              scale: slot.scale,
              top: slot.top,
              x: "-50%",
              y: "-50%"
            },
            "aria-label": `Focus ${skill}`,
            className: "absolute",
            exit: {
              filter: "blur(8px)",
              opacity: 0,
              scale: 0.42,
              x: "-50%",
              y: "-50%"
            },
            initial: {
              filter: "blur(8px)",
              opacity: 0,
              scale: 0.42,
              x: "-50%",
              y: "-50%"
            },
            onClick: () => setActiveSkillIndex(virtualIndex),
            style: { zIndex: slot.zIndex },
            transition: skillFlowTransition,
            type: "button",
            children: /* @__PURE__ */ jsx(SkillTile, { active, skill })
          },
          `${skill}-${virtualIndex}`
        );
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "pointer-events-none absolute inset-x-0 bottom-6 z-[4] flex flex-col items-center text-center sm:bottom-8", children: [
        /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
          motion.h2,
          {
            animate: { opacity: 1, y: 0, filter: "blur(0px)" },
            "aria-live": "polite",
            className: "font-rostex-regular text-[clamp(2.7rem,8vw,5.8rem)] uppercase leading-[0.95] text-white",
            exit: { opacity: 0, y: 22, filter: "blur(8px)" },
            initial: { opacity: 0, y: -18, filter: "blur(8px)" },
            transition: { duration: 0.48, ease: "easeOut" },
            children: activeSkill
          },
          activeSkill
        ) }),
        /* @__PURE__ */ jsx("div", { className: "theme-active-bar mt-6 h-px w-[min(22rem,70vw)]" })
      ] })
    ] })
  ] });
}
function FullSection({ title, children }) {
  return /* @__PURE__ */ jsxs("section", { className: "mx-auto flex min-h-[72vh] w-full max-w-[1120px] flex-col justify-center py-10", children: [
    /* @__PURE__ */ jsx("div", { className: "theme-active-bar mb-6 h-px w-16" }),
    /* @__PURE__ */ jsx("h2", { className: "font-display text-[clamp(2.8rem,8vw,5.5rem)] uppercase tracking-[0.16em] text-white", children: title }),
    /* @__PURE__ */ jsx("div", { className: "mt-8", children })
  ] });
}
function renderFullView(view, content) {
  switch (view) {
    case "projects":
      return /* @__PURE__ */ jsx(FullSection, { title: "Projects", children: /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2", children: content.projects.map((project) => /* @__PURE__ */ jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsx("p", { className: "theme-accent-text text-xs uppercase tracking-[0.24em]", children: project.subtitle }),
        /* @__PURE__ */ jsx("h3", { className: "mt-3 font-display text-2xl text-white", children: project.title }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm leading-7 text-white/72", children: project.description }),
        /* @__PURE__ */ jsx("div", { className: "mt-5 flex flex-wrap gap-2", children: project.stack.map((item) => /* @__PURE__ */ jsx("span", { className: "rounded-full border border-white/10 px-3 py-1 text-xs text-white/70", children: item }, item)) })
      ] }, project.id)) }) });
    case "skills":
      return /* @__PURE__ */ jsx(SkillsShowcase, { skills: content.intro.skills });
    case "experience":
      return /* @__PURE__ */ jsx(FullSection, { title: "Experience", children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: content.experience.map((item) => /* @__PURE__ */ jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 md:flex-row md:items-end md:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-display text-2xl text-white", children: item.role }),
            /* @__PURE__ */ jsx("p", { className: "theme-accent-text mt-1 text-sm uppercase tracking-[0.22em]", children: item.company })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-white/55", children: item.duration })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm leading-7 text-white/72", children: item.description })
      ] }, item.id)) }) });
    case "certificates":
      return /* @__PURE__ */ jsx(FullSection, { title: "Certificates", children: /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2", children: content.certificates.map((item) => /* @__PURE__ */ jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-display text-2xl text-white", children: item.title }),
        /* @__PURE__ */ jsx("p", { className: "theme-accent-text mt-2 text-sm uppercase tracking-[0.22em]", children: item.issuer }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-white/65", children: item.year })
      ] }, item.id)) }) });
    case "education":
      return /* @__PURE__ */ jsx(FullSection, { title: "Education", children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: content.education.map((item) => /* @__PURE__ */ jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 md:flex-row md:items-end md:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-display text-2xl text-white", children: item.degree }),
            /* @__PURE__ */ jsx("p", { className: "theme-accent-text mt-1 text-sm uppercase tracking-[0.22em]", children: item.institution })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-white/55", children: item.duration })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm leading-7 text-white/72", children: item.description })
      ] }, item.id)) }) });
    default:
      return null;
  }
}
const flickerTransition = {
  duration: 0.95,
  ease: "easeOut",
  times: [0, 0.12, 0.22, 0.36, 0.52, 0.7, 1]
};
function PortfolioApp({ initialContent, initialView = "home" }) {
  const [themeIndex, setThemeIndex] = useState(DEFAULT_THEME_INDEX);
  const activeView = initialView;
  const content = useMemo(() => initialContent, [initialContent]);
  const activeTheme = PORTFOLIO_THEMES[themeIndex];
  const themeStyle = useMemo(() => getThemeStyle(activeTheme), [activeTheme]);
  const handleAdvanceTheme = () => {
    setThemeIndex((currentThemeIndex) => (currentThemeIndex + 1) % PORTFOLIO_THEMES.length);
  };
  return /* @__PURE__ */ jsxs("main", { className: "theme-shell relative min-h-screen overflow-hidden text-white", style: themeStyle, children: [
    /* @__PURE__ */ jsx("div", { className: "theme-hero-grid absolute inset-0" }),
    /* @__PURE__ */ jsx("div", { className: "theme-hero-spotlight absolute inset-0 opacity-60" }),
    /* @__PURE__ */ jsx("div", { className: "theme-top-glow absolute inset-0 opacity-40" }),
    activeView === "home" ? /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "font-faded-display pointer-events-none absolute left-1/2 top-[12%] z-0 flex w-max -translate-x-1/2 flex-col items-center text-center text-[clamp(6rem,22vw,20rem)] font-black leading-[0.82] tracking-[0.02em] text-white/[0.025]", children: [
      /* @__PURE__ */ jsx("span", { className: "block text-center", children: "WEB" }),
      /* @__PURE__ */ jsx("span", { className: "block text-center", children: "DEVELOPER" })
    ] }) }) : null,
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 mx-auto flex min-h-screen max-w-[1600px] flex-col px-5 pb-8 pt-6 md:px-8 lg:px-10 xl:px-16", children: [
      /* @__PURE__ */ jsxs("header", { className: "relative z-30 grid grid-cols-[1fr_auto] items-center gap-4 text-[11px] uppercase tracking-[0.42em] text-white/88 md:grid-cols-[1fr_auto_1fr] md:text-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "hidden md:block" }),
        /* @__PURE__ */ jsxs("div", { className: "theme-glass mx-auto flex flex-wrap items-center justify-center gap-6 rounded-full border px-7 py-3 backdrop-blur-2xl md:gap-10 md:px-10", children: [
          views.map((view) => {
            const active = activeView === view.key;
            return /* @__PURE__ */ jsx(
              "a",
              {
                className: cn(
                  "text-[11px] tracking-[0.34em] transition md:text-sm",
                  active ? "theme-nav-active" : "text-white/62 hover:text-white"
                ),
                href: getViewHref(view.key),
                children: view.label
              },
              view.key
            );
          }),
          /* @__PURE__ */ jsx("a", { download: true, href: content.intro.resume_url || "#", children: /* @__PURE__ */ jsxs(Button, { className: "h-10 min-w-[160px] px-4 text-[11px] tracking-[0.16em]", disabled: !content.intro.resume_url, children: [
            /* @__PURE__ */ jsx("span", { children: "Get Resume" }),
            /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-4 w-4" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx(SocialLinks, { className: "flex items-center justify-end gap-4 md:gap-5", content: content.intro })
      ] }),
      /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: activeView === "home" ? /* @__PURE__ */ jsxs(
        motion.div,
        {
          animate: { opacity: 1, y: 0 },
          className: "relative z-0 -mt-8 grid flex-1 items-end gap-8 md:-mt-12 lg:-mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(420px,1fr)]",
          exit: { opacity: 0, y: 20 },
          initial: { opacity: 0, y: 20 },
          transition: { duration: 0.35, ease: "easeOut" },
          children: [
            /* @__PURE__ */ jsx("section", { className: "order-1 relative z-10 min-h-[420px] lg:absolute lg:inset-x-0 lg:top-[4.5rem] lg:min-h-0", children: /* @__PURE__ */ jsx("div", { className: "pointer-events-none flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "relative mt-10 flex w-full max-w-[680px] flex-col items-center md:mt-14 md:max-w-[760px] lg:mt-0 lg:max-w-[860px]", children: [
              /* @__PURE__ */ jsxs("div", { className: "font-rostex-regular mb-[-1.5rem] translate-y-8 text-center text-[clamp(3.4rem,9vw,8.2rem)] font-black leading-[0.82] tracking-[0.04em] text-white lg:mb-[-2.5rem] lg:translate-y-14", children: [
                /* @__PURE__ */ jsx("span", { className: "block text-[1.12em]", children: "WEB" }),
                /* @__PURE__ */ jsxs("span", { className: "relative inline-block", children: [
                  /* @__PURE__ */ jsx("span", { className: "inline-block", children: "DEVELOPER" }),
                  /* @__PURE__ */ jsx(ConstellationWidget, { activeIndex: themeIndex, onAdvance: handleAdvanceTheme, themes: PORTFOLIO_THEMES })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "theme-portrait-orb absolute bottom-[8%] left-[10%] right-[10%] top-[6%] rounded-full blur-[60px]" }),
              /* @__PURE__ */ jsx("div", { className: "relative z-10 -mt-20 w-full md:-mt-24 lg:-mt-32", children: /* @__PURE__ */ jsx(
                motion.img,
                {
                  alt: "Murshida portrait",
                  animate: { opacity: 1, y: 0 },
                  className: "mx-auto w-full max-w-[620px] object-contain drop-shadow-[0_18px_60px_rgba(4,5,18,0.95)] md:max-w-[700px] lg:max-w-[800px]",
                  initial: { opacity: 0, y: 28 },
                  src: content.intro.profile_image_url,
                  transition: { duration: 0.7, ease: "easeOut" }
                }
              ) })
            ] }) }) }),
            /* @__PURE__ */ jsxs("div", { className: "order-3 relative z-20 lg:absolute lg:bottom-4 lg:left-16 xl:bottom-8 xl:left-24", children: [
              /* @__PURE__ */ jsxs("div", { className: "mt-8 text-left", children: [
                /* @__PURE__ */ jsx(
                  motion.p,
                  {
                    animate: {
                      opacity: [0, 0.98, 0.36, 0.9, 0.52, 1, 1],
                      textShadow: [
                        "0 0 28px rgba(255,255,255,0.34)",
                        "0 0 16px rgba(255,255,255,0.18)",
                        "0 0 10px rgba(255,255,255,0.08)",
                        "0 0 12px rgba(255,255,255,0.14)",
                        "0 0 6px rgba(255,255,255,0.05)",
                        "0 0 0 rgba(255,255,255,0)",
                        "0 0 0 rgba(255,255,255,0)"
                      ]
                    },
                    className: "font-rostex-regular text-[1.2rem] uppercase tracking-[0.2em] text-white/78 md:text-[1.42rem] lg:text-[1.68rem]",
                    initial: { opacity: 0, textShadow: "0 0 30px rgba(255,255,255,0.34)" },
                    transition: { ...flickerTransition, delay: 0.12 },
                    children: content.intro.name.replace(/\./g, "")
                  }
                ),
                /* @__PURE__ */ jsx(
                  motion.p,
                  {
                    animate: {
                      opacity: [0, 0.84, 0.22, 0.76, 0.44, 1, 1],
                      textShadow: [
                        "0 0 18px rgba(186,196,220,0.24)",
                        "0 0 10px rgba(186,196,220,0.16)",
                        "0 0 4px rgba(186,196,220,0.08)",
                        "0 0 8px rgba(186,196,220,0.12)",
                        "0 0 3px rgba(186,196,220,0.06)",
                        "0 0 0 rgba(186,196,220,0)",
                        "0 0 0 rgba(186,196,220,0)"
                      ]
                    },
                    className: "theme-faint-copy font-open-sans-light mt-3 max-w-[280px] text-[0.82rem] font-light leading-6 tracking-[0.04em] md:max-w-[320px] md:text-[0.88rem] lg:max-w-[340px]",
                    initial: { opacity: 0, textShadow: "0 0 20px rgba(186,196,220,0.22)" },
                    transition: { ...flickerTransition, delay: 0.24 },
                    children: content.intro.intro
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(SocialLinks, { className: "mt-10 flex flex-wrap gap-4 lg:hidden", content: content.intro })
            ] })
          ]
        },
        "home"
      ) : /* @__PURE__ */ jsx(
        motion.div,
        {
          animate: { opacity: 1, y: 0 },
          className: "relative z-0 flex flex-1",
          exit: { opacity: 0, y: 20 },
          initial: { opacity: 0, y: 20 },
          transition: { duration: 0.35, ease: "easeOut" },
          children: renderFullView(activeView, content)
        },
        activeView
      ) })
    ] })
  ] });
}

export { PortfolioApp as P };
