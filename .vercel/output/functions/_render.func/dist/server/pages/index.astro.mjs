import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_y1XpGNYX.mjs';
import 'piccolore';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useReducedMotion, motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Phone, Mail } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { C as Card, c as cn, B as Button, f as fetchPortfolioContent, $ as $$BaseLayout } from '../chunks/BaseLayout_DbZpIjNz.mjs';
export { renderers } from '../renderers.mjs';

const WIDGET_TITLE = "One thing I'm also enthusiastic about is stars!";
const WIDGET_SUBTITLE = "How about we explore some star constellations?";
const CONSTELLATIONS = [
  {
    id: "orion",
    name: "Orion",
    description: "Famous for its central belt of three bright stars!",
    stars: [
      { id: "A", x: 28, y: 14 },
      { id: "B", x: 18, y: 36 },
      { id: "C", x: 48, y: 26 },
      { id: "D", x: 58, y: 50 },
      { id: "E", x: 52, y: 60 },
      { id: "F", x: 52, y: 88 },
      { id: "G", x: 86, y: 68 },
      { id: "H", x: 64, y: 46 }
    ],
    connections: [
      ["A", "B"],
      ["A", "C"],
      ["B", "E"],
      ["C", "H"],
      ["H", "D"],
      ["D", "E"],
      ["E", "F"],
      ["E", "G"],
      ["F", "G"]
    ]
  },
  {
    id: "taurus",
    name: "Taurus",
    description: "Its V-shaped face and long horns make it easy to recognize.",
    stars: [
      { id: "A", x: 16, y: 38 },
      { id: "B", x: 28, y: 48 },
      { id: "C", x: 44, y: 48 },
      { id: "D", x: 56, y: 34 },
      { id: "E", x: 70, y: 18 },
      { id: "F", x: 82, y: 12 },
      { id: "G", x: 72, y: 30 },
      { id: "H", x: 58, y: 60 },
      { id: "I", x: 52, y: 74 }
    ],
    connections: [
      ["A", "B"],
      ["B", "C"],
      ["C", "D"],
      ["D", "E"],
      ["E", "F"],
      ["E", "G"],
      ["D", "H"],
      ["H", "I"]
    ]
  },
  {
    id: "ursa-major",
    name: "Ursa Major",
    description: "Its Big Dipper asterism is one of the easiest shapes to spot.",
    stars: [
      { id: "A", x: 18, y: 40 },
      { id: "B", x: 30, y: 26 },
      { id: "C", x: 42, y: 44 },
      { id: "D", x: 28, y: 58 },
      { id: "E", x: 56, y: 40 },
      { id: "F", x: 70, y: 36 },
      { id: "G", x: 84, y: 30 }
    ],
    connections: [
      ["A", "B"],
      ["B", "C"],
      ["C", "D"],
      ["D", "A"],
      ["C", "E"],
      ["E", "F"],
      ["F", "G"]
    ]
  },
  {
    id: "cassiopeia",
    name: "Cassiopeia",
    description: "Recognizable for its graceful W-shaped zigzag across the sky.",
    stars: [
      { id: "A", x: 14, y: 18 },
      { id: "B", x: 30, y: 38 },
      { id: "C", x: 48, y: 36 },
      { id: "D", x: 66, y: 60 },
      { id: "E", x: 84, y: 34 }
    ],
    connections: [
      ["A", "B"],
      ["B", "C"],
      ["C", "D"],
      ["D", "E"]
    ]
  },
  {
    id: "leo",
    name: "Leo",
    description: "This lion-like outline is anchored by the sickle near its head.",
    stars: [
      { id: "A", x: 12, y: 72 },
      { id: "B", x: 32, y: 44 },
      { id: "C", x: 36, y: 72 },
      { id: "D", x: 66, y: 40 },
      { id: "E", x: 72, y: 22 },
      { id: "F", x: 90, y: 10 },
      { id: "G", x: 96, y: 18 },
      { id: "H", x: 80, y: 54 },
      { id: "I", x: 80, y: 72 }
    ],
    connections: [
      ["A", "B"],
      ["A", "C"],
      ["B", "C"],
      ["B", "D"],
      ["C", "I"],
      ["D", "E"],
      ["E", "F"],
      ["F", "G"],
      ["D", "H"],
      ["H", "I"]
    ]
  },
  {
    id: "scorpius",
    name: "Scorpius",
    description: "Its long curving tail gives this constellation a dramatic silhouette.",
    stars: [
      { id: "A", x: 12, y: 70 },
      { id: "B", x: 20, y: 58 },
      { id: "C", x: 28, y: 70 },
      { id: "D", x: 44, y: 70 },
      { id: "E", x: 58, y: 66 },
      { id: "F", x: 60, y: 44 },
      { id: "G", x: 68, y: 22 },
      { id: "H", x: 76, y: 16 },
      { id: "I", x: 86, y: 10 },
      { id: "J", x: 88, y: 20 },
      { id: "K", x: 98, y: 14 }
    ],
    connections: [
      ["A", "B"],
      ["B", "C"],
      ["C", "D"],
      ["D", "E"],
      ["E", "F"],
      ["F", "G"],
      ["G", "H"],
      ["H", "I"],
      ["H", "J"],
      ["H", "K"]
    ]
  },
  {
    id: "andromeda",
    name: "Andromeda",
    description: "A long chained line of stars that drifts elegantly across the sky.",
    stars: [
      { id: "A", x: 30, y: 12 },
      { id: "B", x: 18, y: 30 },
      { id: "C", x: 44, y: 40 },
      { id: "D", x: 48, y: 52 },
      { id: "E", x: 44, y: 64 },
      { id: "F", x: 56, y: 58 },
      { id: "G", x: 60, y: 48 },
      { id: "H", x: 64, y: 40 },
      { id: "I", x: 72, y: 60 },
      { id: "J", x: 90, y: 84 }
    ],
    connections: [
      ["A", "C"],
      ["B", "E"],
      ["C", "D"],
      ["D", "E"],
      ["D", "F"],
      ["F", "G"],
      ["G", "H"],
      ["F", "I"],
      ["I", "J"]
    ]
  }
];
function normalizeConnection(a, b) {
  return [a, b].sort().join("__");
}
function findStar(stars, id) {
  return stars.find((star) => star.id === id);
}
function starDelay(id) {
  return id.charCodeAt(0) % 7 * 0.35;
}
function ConstellationWidget() {
  const prefersReducedMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedStar, setSelectedStar] = useState(null);
  const [userConnections, setUserConnections] = useState([]);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const constellation = CONSTELLATIONS[currentIndex];
  const correctConnections = useMemo(
    () => constellation.connections.map(([from, to]) => normalizeConnection(from, to)),
    [constellation]
  );
  const isComplete = useMemo(() => {
    if (userConnections.length !== correctConnections.length) {
      return false;
    }
    return userConnections.every((connection) => correctConnections.includes(connection));
  }, [correctConnections, userConnections]);
  useEffect(() => {
    if (!isComplete) {
      setIsFadingOut(false);
      return;
    }
    const fadeDelay = prefersReducedMotion ? 900 : 1400;
    const advanceDelay = prefersReducedMotion ? 1250 : 2150;
    const fadeTimer = window.setTimeout(() => {
      setIsFadingOut(true);
    }, fadeDelay);
    const nextTimer = window.setTimeout(() => {
      setCurrentIndex((previous) => (previous + 1) % CONSTELLATIONS.length);
      setSelectedStar(null);
      setUserConnections([]);
      setIsFadingOut(false);
    }, advanceDelay);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(nextTimer);
    };
  }, [isComplete, prefersReducedMotion]);
  const handleStarSelect = (starId) => {
    if (isComplete || isFadingOut) {
      return;
    }
    if (selectedStar === null) {
      setSelectedStar(starId);
      return;
    }
    if (selectedStar === starId) {
      setSelectedStar(null);
      return;
    }
    const connectionKey = normalizeConnection(selectedStar, starId);
    setUserConnections(
      (previous) => previous.includes(connectionKey) ? previous.filter((connection) => connection !== connectionKey) : [...previous, connectionKey]
    );
    setSelectedStar(starId);
  };
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      animate: { opacity: 1, y: 0 },
      className: "w-full max-w-[360px]",
      initial: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
      transition: { duration: 0.45, ease: "easeOut" },
      children: /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden border-white/12 bg-[linear-gradient(180deg,rgba(10,14,34,0.84),rgba(7,9,22,0.72))] p-4 shadow-[0_24px_80px_rgba(4,8,24,0.45)] md:p-5", children: [
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(116,104,255,0.15),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(78,119,255,0.14),transparent_38%)]" }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-4 space-y-1", children: [
            /* @__PURE__ */ jsx("p", { className: "font-open-sans-light text-[0.68rem] uppercase tracking-[0.22em] text-[#98a0c4]/72", children: "starfield note" }),
            /* @__PURE__ */ jsx("h3", { className: "max-w-[20rem] font-display text-[0.98rem] leading-6 text-white/86 md:text-[1.05rem]", children: WIDGET_TITLE }),
            /* @__PURE__ */ jsx("p", { className: "font-open-sans-light text-[0.82rem] leading-5 text-[#aeb7cf]/58", children: WIDGET_SUBTITLE })
          ] }),
          /* @__PURE__ */ jsx(
            motion.div,
            {
              animate: isComplete && !prefersReducedMotion ? {
                boxShadow: [
                  "0 0 0 rgba(118,116,255,0)",
                  "0 0 34px rgba(118,116,255,0.18)",
                  "0 0 0 rgba(118,116,255,0)"
                ]
              } : { boxShadow: "0 0 0 rgba(118,116,255,0)" },
              className: cn(
                "relative rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0.01))] px-3 py-3",
                isComplete ? "border-[#8688ff]/30" : "border-white/8"
              ),
              children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxs(
                motion.div,
                {
                  animate: { opacity: isFadingOut ? 0 : 1, scale: isFadingOut ? 0.985 : 1 },
                  className: "relative h-[230px] w-full",
                  initial: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.985 },
                  transition: { duration: prefersReducedMotion ? 0.2 : 0.45, ease: "easeOut" },
                  children: [
                    /* @__PURE__ */ jsx(
                      "svg",
                      {
                        "aria-hidden": "true",
                        className: "absolute inset-0 h-full w-full overflow-visible",
                        preserveAspectRatio: "none",
                        viewBox: "0 0 100 100",
                        children: userConnections.map((connection) => {
                          const [fromId, toId] = connection.split("__");
                          const fromStar = findStar(constellation.stars, fromId);
                          const toStar = findStar(constellation.stars, toId);
                          if (!fromStar || !toStar) {
                            return null;
                          }
                          const isCorrect = correctConnections.includes(connection);
                          return /* @__PURE__ */ jsx(
                            motion.line,
                            {
                              animate: isComplete && !prefersReducedMotion ? { opacity: [0.8, 1, 0.84] } : { opacity: isCorrect ? 0.9 : 0.62 },
                              initial: { opacity: 0 },
                              stroke: isCorrect ? "rgba(158, 182, 255, 0.96)" : "rgba(132, 118, 232, 0.68)",
                              strokeLinecap: "round",
                              strokeWidth: "1.35",
                              style: {
                                filter: isCorrect ? "drop-shadow(0 0 10px rgba(111,149,255,0.95))" : "drop-shadow(0 0 7px rgba(132,118,232,0.58))"
                              },
                              transition: { duration: prefersReducedMotion ? 0.12 : 0.22, ease: "easeOut" },
                              vectorEffect: "non-scaling-stroke",
                              x1: fromStar.x,
                              x2: toStar.x,
                              y1: fromStar.y,
                              y2: toStar.y
                            },
                            connection
                          );
                        })
                      }
                    ),
                    constellation.stars.map((star) => {
                      const isSelected = selectedStar === star.id;
                      return /* @__PURE__ */ jsxs(
                        motion.button,
                        {
                          animate: prefersReducedMotion ? { opacity: 1, scale: isSelected ? 1.08 : 1 } : {
                            opacity: isComplete ? [0.9, 1, 0.92] : [0.82, 1, 0.84],
                            scale: isSelected ? 1.18 : [1, 1.08, 1]
                          },
                          "aria-label": `Select star ${star.id} in ${constellation.name}`,
                          className: "absolute -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b8dff]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090d1f]",
                          onClick: () => handleStarSelect(star.id),
                          style: { left: `${star.x}%`, top: `${star.y}%` },
                          transition: {
                            duration: prefersReducedMotion ? 0.16 : 2.2,
                            ease: "easeInOut",
                            repeat: prefersReducedMotion ? 0 : Number.POSITIVE_INFINITY,
                            delay: prefersReducedMotion ? 0 : starDelay(star.id)
                          },
                          type: "button",
                          children: [
                            /* @__PURE__ */ jsx(
                              "span",
                              {
                                className: cn(
                                  "absolute inset-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full",
                                  isSelected ? "bg-[#9ca7ff]/16" : "bg-transparent"
                                )
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              "span",
                              {
                                className: cn(
                                  "absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border",
                                  isSelected ? "h-4 w-4 border-[#bcc6ff]/75" : "h-0 w-0 border-transparent"
                                )
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              "span",
                              {
                                className: cn(
                                  "relative block rounded-full",
                                  isSelected ? "h-[0.56rem] w-[0.56rem] bg-[#eef3ff] shadow-[0_0_16px_rgba(161,184,255,1)]" : "h-[0.42rem] w-[0.42rem] bg-[#eef2ff] shadow-[0_0_12px_rgba(126,162,255,0.9)]"
                                )
                              }
                            )
                          ]
                        },
                        star.id
                      );
                    })
                  ]
                },
                constellation.id
              ) })
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "mt-4 min-h-[2.75rem]", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: isComplete ? /* @__PURE__ */ jsxs(
            motion.div,
            {
              animate: { opacity: 1, y: 0 },
              initial: { opacity: 0, y: 8 },
              transition: { duration: prefersReducedMotion ? 0.18 : 0.35, ease: "easeOut" },
              children: [
                /* @__PURE__ */ jsx("p", { className: "font-display text-[0.84rem] tracking-[0.1em] text-[#b7c1ff]", children: constellation.name }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 font-open-sans-light text-[0.8rem] leading-5 text-[#c8d0e3]/68", children: constellation.description })
              ]
            },
            constellation.id + "-complete"
          ) : /* @__PURE__ */ jsxs(
            motion.p,
            {
              animate: { opacity: 1 },
              className: "font-open-sans-light text-[0.76rem] leading-5 text-[#aeb7cf]/42",
              initial: { opacity: 0 },
              transition: { duration: prefersReducedMotion ? 0.12 : 0.28 },
              children: [
                "Connect the stars to reveal ",
                constellation.name,
                "."
              ]
            },
            constellation.id + "-hint"
          ) }) })
        ] })
      ] })
    }
  );
}

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
    { href: `tel:${content.phone}`, label: "Call", icon: /* @__PURE__ */ jsx(Phone, { className: "h-5 w-5" }) },
    { href: `mailto:${content.email}`, label: "Email", icon: /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5" }) }
  ];
  return /* @__PURE__ */ jsx("div", { className, children: items.map((item) => /* @__PURE__ */ jsx(
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
  )) });
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
            ] }),
            /* @__PURE__ */ jsx("div", { className: "order-4 relative z-20 mt-8 flex justify-end lg:absolute lg:bottom-6 lg:right-8 lg:mt-0 xl:bottom-10 xl:right-14", children: /* @__PURE__ */ jsx(ConstellationWidget, {}) })
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
