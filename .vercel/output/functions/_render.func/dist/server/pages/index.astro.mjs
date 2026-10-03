import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_Dh7I1v3r.mjs';
import 'piccolore';
import { jsx, jsxs } from 'react/jsx-runtime';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { C as ContactModal, P as PORTFOLIO_THEMES, D as DEFAULT_THEME_INDEX, $ as $$PortfolioShell } from '../chunks/PortfolioShell_Knod_3g2.mjs';
import { B as Button } from '../chunks/BaseLayout_v141w-eY.mjs';
import { f as fetchPortfolioContent } from '../chunks/content_Ch1Ctvhc.mjs';
export { renderers } from '../renderers.mjs';

function ConstellationWidget({ activeIndex, themes }) {
  const activeTheme = themes[activeIndex];
  const accent = activeTheme.colors[3];
  const accentSoft = activeTheme.colors[4];
  const startX = 2;
  const endX = 98;
  const span = endX - startX;
  return /* @__PURE__ */ jsx(
    "div",
    {
      "aria-hidden": "true",
      className: "pointer-events-none absolute left-0 top-[calc(100%+0.55rem)] z-20 h-9 w-full md:top-[calc(100%+0.7rem)]",
      style: { opacity: 0.56 },
      children: /* @__PURE__ */ jsxs("div", { "aria-hidden": "true", className: "relative h-full w-full", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute top-1/2 h-px -translate-y-1/2 rounded-full",
            style: {
              left: `${startX}%`,
              right: `${100 - endX}%`,
              backgroundColor: accentSoft,
              opacity: 0.42
            }
          }
        ),
        themes.map((theme, index) => {
          const x = startX + span * index / (themes.length - 1);
          const active = index === activeIndex;
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: "absolute top-1/2",
              style: {
                left: `${x}%`,
                opacity: active ? 1 : 0.5,
                transform: "translate(-50%, -50%)",
                transformOrigin: "center"
              },
              children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
                    style: {
                      backgroundColor: active ? accent : accentSoft,
                      opacity: active ? 0.24 : 0.05
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
                      opacity: active ? 0.92 : 0.68
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

function HomePage({ intro }) {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const roleWords = intro.role.trim() ? intro.role.trim().split(/\s+/) : ["Web", "Developer"];
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      animate: { opacity: 1, y: 0 },
      className: "relative z-0 -mt-8 grid flex-1 items-end gap-8 md:-mt-12 lg:-mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(420px,1fr)]",
      initial: { opacity: 0, y: 20 },
      transition: { duration: 0.35, ease: "easeOut" },
      children: [
        /* @__PURE__ */ jsx(ContactModal, { email: intro.email, onClose: () => setContactModalOpen(false), open: contactModalOpen }),
        /* @__PURE__ */ jsx("section", { className: "order-1 relative z-10 min-h-[420px] lg:absolute lg:inset-x-0 lg:top-[4.5rem] lg:min-h-0", children: /* @__PURE__ */ jsx("div", { className: "pointer-events-none flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "relative mt-10 flex w-full max-w-[680px] flex-col items-center md:mt-14 md:max-w-[760px] lg:mt-0 lg:max-w-[860px]", children: [
          /* @__PURE__ */ jsx("div", { className: "font-rostex-regular relative z-20 mb-[-1.5rem] translate-y-8 text-center text-[clamp(3.4rem,9vw,8.2rem)] font-black leading-[0.82] tracking-[0.02em] text-zinc-950 lg:mb-[-2.5rem] lg:translate-y-14", children: roleWords.map(
            (word, index) => index === roleWords.length - 1 ? /* @__PURE__ */ jsxs("span", { className: "relative inline-block", children: [
              /* @__PURE__ */ jsx("span", { className: "inline-block", children: word.toUpperCase() }),
              /* @__PURE__ */ jsx(ConstellationWidget, { activeIndex: DEFAULT_THEME_INDEX, themes: PORTFOLIO_THEMES })
            ] }, `${word}-${index}`) : /* @__PURE__ */ jsx("span", { className: index === 0 ? "block text-[1.12em]" : "block", children: word.toUpperCase() }, `${word}-${index}`)
          ) }),
          /* @__PURE__ */ jsx("div", { className: "theme-portrait-orb absolute bottom-[8%] left-[10%] right-[10%] top-[6%]" }),
          /* @__PURE__ */ jsxs("div", { className: "relative z-30 -mt-32 w-full md:-mt-40 lg:-mt-48", children: [
            /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute bottom-[6%] left-1/2 h-[64%] w-[58%] -translate-x-1/2 rounded-full bg-black/30 blur-3xl" }),
            /* @__PURE__ */ jsx(
              motion.img,
              {
                alt: "Murshida portrait",
                animate: { opacity: 1, y: 0 },
                className: "relative z-10 mx-auto w-full max-w-[620px] object-contain grayscale md:max-w-[700px] lg:max-w-[800px]",
                initial: { opacity: 0, y: 28 },
                src: intro.profile_image_url || "/images/profile-picture.png",
                transition: { duration: 0.7, ease: "easeOut" }
              }
            )
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            animate: { opacity: 1, x: 0 },
            className: "pointer-events-auto order-3 relative z-20 max-w-[31rem] text-left lg:absolute lg:bottom-4 lg:left-16 xl:bottom-8 xl:left-24",
            initial: { opacity: 0, x: -22 },
            transition: { duration: 0.5, delay: 0.18, ease: "easeOut" },
            children: [
              /* @__PURE__ */ jsx("p", { className: "font-rostex-regular text-[clamp(1.25rem,2.8vw,2.2rem)] uppercase leading-[0.95] tracking-[0.08em] text-zinc-950", children: "MURSHIDA P" }),
              /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [
                /* @__PURE__ */ jsx("a", { download: true, href: intro.resume_url ? "/api/resume" : "#", children: /* @__PURE__ */ jsxs(Button, { disabled: !intro.resume_url, type: "button", children: [
                  /* @__PURE__ */ jsx("span", { children: "Get Resume" }),
                  /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-4 w-4" })
                ] }) }),
                /* @__PURE__ */ jsx(Button, { onClick: () => setContactModalOpen(true), type: "button", variant: "secondary", children: "Connect" })
              ] })
            ]
          }
        )
      ]
    }
  );
}

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const initialContent = await fetchPortfolioContent();
  return renderTemplate`${renderComponent($$result, "PortfolioShell", $$PortfolioShell, { "activeView": "home", "intro": initialContent.intro, "title": "Web Developer" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "HomePage", HomePage, { "client:load": true, "intro": initialContent.intro, "client:component-hydration": "load", "client:component-path": "@/components/portfolio/HomePage", "client:component-export": "default" })} ` })}`;
}, "C:/Murshida/Career/portfolio/src/pages/index.astro", void 0);

const $$file = "C:/Murshida/Career/portfolio/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
