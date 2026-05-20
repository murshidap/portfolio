import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_y1XpGNYX.mjs';
import 'piccolore';
import { jsxs, jsx } from 'react/jsx-runtime';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Mail, Share2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { c as cn, B as Button, C as Card, f as fetchPortfolioContent, $ as $$BaseLayout } from '../chunks/BaseLayout_BDOZkNr3.mjs';
export { renderers } from '../renderers.mjs';

const views = [
  { key: "home", label: "Home" },
  { key: "skills", label: "Skills" },
  { key: "projects", label: "Projects" },
  { key: "experience", label: "Experience" },
  { key: "certificates", label: "Certificates" },
  { key: "education", label: "Education" }
];
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
function FullSection({ title, children }) {
  return /* @__PURE__ */ jsxs("section", { className: "mx-auto flex min-h-[72vh] w-full max-w-[1120px] flex-col justify-center py-10", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-6 h-px w-16 bg-[linear-gradient(90deg,#6671ff,transparent)]" }),
    /* @__PURE__ */ jsx("h2", { className: "font-display text-[clamp(2.8rem,8vw,5.5rem)] uppercase tracking-[0.16em] text-white", children: title }),
    /* @__PURE__ */ jsx("div", { className: "mt-8", children })
  ] });
}
function renderFullView(view, content) {
  switch (view) {
    case "projects":
      return /* @__PURE__ */ jsx(FullSection, { title: "Projects", children: /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2", children: content.projects.map((project) => /* @__PURE__ */ jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-[0.24em] text-[#7d85ff]", children: project.subtitle }),
        /* @__PURE__ */ jsx("h3", { className: "mt-3 font-display text-2xl text-white", children: project.title }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm leading-7 text-white/72", children: project.description }),
        /* @__PURE__ */ jsx("div", { className: "mt-5 flex flex-wrap gap-2", children: project.stack.map((item) => /* @__PURE__ */ jsx("span", { className: "rounded-full border border-white/10 px-3 py-1 text-xs text-white/70", children: item }, item)) })
      ] }, project.id)) }) });
    case "skills":
      return /* @__PURE__ */ jsx(FullSection, { title: "Skills", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-4", children: content.intro.skills.map((skill) => /* @__PURE__ */ jsx(
        "span",
        {
          className: "rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm uppercase tracking-[0.18em] text-white/72 backdrop-blur-xl",
          children: skill
        },
        skill
      )) }) });
    case "experience":
      return /* @__PURE__ */ jsx(FullSection, { title: "Experience", children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: content.experience.map((item) => /* @__PURE__ */ jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 md:flex-row md:items-end md:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-display text-2xl text-white", children: item.role }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm uppercase tracking-[0.22em] text-[#7d85ff]", children: item.company })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-white/55", children: item.duration })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm leading-7 text-white/72", children: item.description })
      ] }, item.id)) }) });
    case "certificates":
      return /* @__PURE__ */ jsx(FullSection, { title: "Certificates", children: /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2", children: content.certificates.map((item) => /* @__PURE__ */ jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-display text-2xl text-white", children: item.title }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm uppercase tracking-[0.22em] text-[#7d85ff]", children: item.issuer }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-white/65", children: item.year })
      ] }, item.id)) }) });
    case "education":
      return /* @__PURE__ */ jsx(FullSection, { title: "Education", children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: content.education.map((item) => /* @__PURE__ */ jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 md:flex-row md:items-end md:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-display text-2xl text-white", children: item.degree }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm uppercase tracking-[0.22em] text-[#7d85ff]", children: item.institution })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-white/55", children: item.duration })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm leading-7 text-white/72", children: item.description })
      ] }, item.id)) }) });
    default:
      return null;
  }
}
function PortfolioApp({ initialContent }) {
  const [activeView, setActiveView] = useState("home");
  const content = useMemo(() => initialContent, [initialContent]);
  return /* @__PURE__ */ jsxs("main", { className: "relative min-h-screen overflow-hidden bg-[#050818] text-white", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-hero-grid" }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 opacity-60",
        style: {
          backgroundImage: "radial-gradient(circle at 65% 36%, rgba(78, 119, 255, 0.58), transparent 16%), radial-gradient(circle at 82% 82%, rgba(123, 78, 255, 0.28), transparent 14%)"
        }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_28%)] opacity-40" }),
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "font-faded-display pointer-events-none absolute left-1/2 top-[12%] z-0 flex w-max -translate-x-1/2 flex-col items-center text-center text-[clamp(6rem,22vw,20rem)] font-black leading-[0.82] tracking-[0.02em] text-white/[0.025]", children: [
      /* @__PURE__ */ jsx("span", { className: "block text-center", children: "WEB" }),
      /* @__PURE__ */ jsx("span", { className: "block text-center", children: "DEVELOPER" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 mx-auto flex min-h-screen max-w-[1600px] flex-col px-5 pb-8 pt-6 md:px-8 lg:px-10 xl:px-16", children: [
      /* @__PURE__ */ jsxs("header", { className: "relative z-30 grid grid-cols-[1fr_auto] items-center gap-4 text-[11px] uppercase tracking-[0.42em] text-white/88 md:grid-cols-[1fr_auto_1fr] md:text-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "hidden md:block" }),
        /* @__PURE__ */ jsxs("div", { className: "mx-auto flex flex-wrap items-center justify-center gap-6 rounded-full border border-white/10 bg-white/[0.05] px-7 py-3 shadow-panel backdrop-blur-2xl md:gap-10 md:px-10", children: [
          views.map((view) => {
            const active = activeView === view.key;
            return /* @__PURE__ */ jsx(
              "button",
              {
                className: cn(
                  "text-[11px] tracking-[0.34em] transition md:text-sm",
                  active ? "text-[#8d73ff]" : "text-white/62 hover:text-white"
                ),
                onClick: () => setActiveView(view.key),
                type: "button",
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
                /* @__PURE__ */ jsx("span", { className: "block", children: "DEVELOPER" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "absolute bottom-[8%] left-[10%] right-[10%] top-[6%] rounded-full bg-[radial-gradient(circle,rgba(77,116,255,0.82),rgba(77,116,255,0.18)_45%,transparent_70%)] blur-[60px]" }),
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
                /* @__PURE__ */ jsx("p", { className: "font-rostex-regular text-[1.2rem] uppercase tracking-[0.2em] text-white/78 md:text-[1.42rem] lg:text-[1.68rem]", children: content.intro.name.replace(/\./g, "") }),
                /* @__PURE__ */ jsx("p", { className: "font-open-sans-light mt-3 max-w-[280px] text-[0.82rem] font-light leading-6 tracking-[0.04em] text-[#9ca5bb]/32 md:max-w-[320px] md:text-[0.88rem] lg:max-w-[340px]", children: content.intro.intro })
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

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const initialContent = await fetchPortfolioContent();
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Murshida P. | Web Developer" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "PortfolioApp", PortfolioApp, { "client:load": true, "initialContent": initialContent, "client:component-hydration": "load", "client:component-path": "@/components/portfolio/PortfolioApp", "client:component-export": "PortfolioApp" })} ` })}`;
}, "C:/Murshida/Career/murshida-portfolio/src/pages/index.astro", void 0);

const $$file = "C:/Murshida/Career/murshida-portfolio/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
