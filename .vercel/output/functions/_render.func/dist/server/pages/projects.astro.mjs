import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_tE5jNKah.mjs';
import 'piccolore';
import { $ as $$PortfolioShell } from '../chunks/PortfolioShell_s9hWfDyt.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useMemo, useLayoutEffect } from 'react';
import { c as cn } from '../chunks/BaseLayout_Dif1Ba7Q.mjs';
import { f as fetchPortfolioContent } from '../chunks/content_Cl0kQkyE.mjs';
export { renderers } from '../renderers.mjs';

function getProjectScreenshots(project) {
  const urls = [project.image_url, ...project.screenshot_urls ?? []].map((url) => url.trim()).filter(Boolean);
  return Array.from(new Set(urls));
}
function ProjectScreenshot({ alt, src }) {
  if (src) {
    return /* @__PURE__ */ jsx("img", { alt, className: "h-full w-full object-cover", src });
  }
  return null;
}
function getProjectCellIndex(project, availableCells, usedCells) {
  const source = `${project.id}-${project.title}`;
  let hash = 0;
  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) % availableCells.length;
  }
  let cellIndex = availableCells[hash];
  let nextIndex = hash;
  while (usedCells.has(cellIndex)) {
    nextIndex = (nextIndex + 1) % availableCells.length;
    cellIndex = availableCells[nextIndex];
  }
  usedCells.add(cellIndex);
  return cellIndex;
}
const projectGridColumns = 27;
const projectGridRows = 15;
const projectWheelQuietDelay = 420;
function ProjectsPage({ projects }) {
  const [focusedProjectIndex, setFocusedProjectIndex] = useState(0);
  const [projectGridOffset, setProjectGridOffset] = useState({ x: 0, y: 0 });
  const [projectScreenshotCycle, setProjectScreenshotCycle] = useState({ projectId: "", index: 0 });
  const sectionRef = useRef(null);
  const projectGridRef = useRef(null);
  const projectSpotlightRef = useRef(null);
  const wheelLockRef = useRef(false);
  const wheelLockTimeoutRef = useRef(null);
  useEffect(() => {
    setFocusedProjectIndex(0);
  }, [projects.length]);
  useEffect(() => {
    return () => {
      if (wheelLockTimeoutRef.current) {
        window.clearTimeout(wheelLockTimeoutRef.current);
      }
    };
  }, []);
  if (projects.length === 0) {
    return null;
  }
  const focusedProject = projects[Math.min(Math.max(focusedProjectIndex, 0), projects.length - 1)];
  const focusedProjectScreenshots = useMemo(() => getProjectScreenshots(focusedProject), [focusedProject]);
  const focusedScreenshotIndex = projectScreenshotCycle.projectId === focusedProject.id ? projectScreenshotCycle.index : 0;
  const focusedScreenshot = focusedProjectScreenshots[focusedScreenshotIndex] ?? focusedProjectScreenshots[0] ?? "";
  const tileCount = projectGridColumns * projectGridRows;
  const availableProjectCells = useMemo(() => {
    const cells = [];
    for (let row = 4; row <= 10; row += 1) {
      for (let column = 8; column <= 18; column += 1) {
        cells.push(row * projectGridColumns + column);
      }
    }
    return cells;
  }, []);
  const usedProjectCells = /* @__PURE__ */ new Set();
  const projectByCell = /* @__PURE__ */ new Map();
  const projectCellById = /* @__PURE__ */ new Map();
  projects.forEach((project) => {
    const cellIndex = getProjectCellIndex(project, availableProjectCells, usedProjectCells);
    projectByCell.set(cellIndex, project);
    projectCellById.set(project.id, cellIndex);
  });
  const projectTiles = Array.from({ length: tileCount }, (_, tileIndex) => ({
    id: `project-cell-${tileIndex}`,
    project: projectByCell.get(tileIndex) ?? null
  }));
  const focusedProjectCell = projectCellById.get(focusedProject.id) ?? 0;
  useEffect(() => {
    setProjectScreenshotCycle({ projectId: focusedProject.id, index: 0 });
    if (focusedProjectScreenshots.length <= 1) {
      return;
    }
    let intervalId = null;
    const firstSwipeId = window.setTimeout(() => {
      setProjectScreenshotCycle({ projectId: focusedProject.id, index: 1 });
      intervalId = window.setInterval(() => {
        setProjectScreenshotCycle((current) => ({
          projectId: focusedProject.id,
          index: current.projectId === focusedProject.id ? (current.index + 1) % focusedProjectScreenshots.length : 0
        }));
      }, 2600);
    }, 1700);
    return () => {
      window.clearTimeout(firstSwipeId);
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [focusedProject.id, focusedProjectScreenshots.length]);
  useLayoutEffect(() => {
    const updateGridOffset = () => {
      const section = sectionRef.current;
      const grid = projectGridRef.current;
      const spotlight = projectSpotlightRef.current;
      const focusedCell = grid?.children[focusedProjectCell];
      if (!section || !grid || !spotlight || !focusedCell) {
        return;
      }
      const sectionRect = section.getBoundingClientRect();
      const spotlightRect = spotlight.getBoundingClientRect();
      const spotlightCenterX = spotlightRect.left + spotlightRect.width / 2;
      const spotlightCenterY = spotlightRect.top + spotlightRect.height / 2;
      const focusedCellCenterX = sectionRect.left + focusedCell.offsetLeft + focusedCell.offsetWidth / 2;
      const focusedCellCenterY = sectionRect.top + focusedCell.offsetTop + focusedCell.offsetHeight / 2;
      setProjectGridOffset({
        x: spotlightCenterX - focusedCellCenterX,
        y: spotlightCenterY - focusedCellCenterY
      });
    };
    updateGridOffset();
    window.addEventListener("resize", updateGridOffset);
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateGridOffset) : null;
    if (resizeObserver) {
      if (sectionRef.current) {
        resizeObserver.observe(sectionRef.current);
      }
      if (projectGridRef.current) {
        resizeObserver.observe(projectGridRef.current);
      }
      if (projectSpotlightRef.current) {
        resizeObserver.observe(projectSpotlightRef.current);
      }
    }
    return () => {
      window.removeEventListener("resize", updateGridOffset);
      resizeObserver?.disconnect();
    };
  }, [focusedProjectCell, projects.length]);
  const handleProjectWheel = (event) => {
    if (projects.length <= 1) {
      return;
    }
    event.preventDefault();
    if (wheelLockRef.current || event.deltaY === 0) {
      return;
    }
    if (wheelLockTimeoutRef.current) {
      window.clearTimeout(wheelLockTimeoutRef.current);
    }
    wheelLockRef.current = true;
    setFocusedProjectIndex((currentIndex) => {
      if (event.deltaY > 0) {
        return Math.min(projects.length - 1, currentIndex + 1);
      }
      if (event.deltaY < 0) {
        return Math.max(0, currentIndex - 1);
      }
      return currentIndex;
    });
    wheelLockTimeoutRef.current = window.setTimeout(() => {
      wheelLockRef.current = false;
      wheelLockTimeoutRef.current = null;
    }, projectWheelQuietDelay);
  };
  return /* @__PURE__ */ jsxs("section", { ref: sectionRef, className: "fixed inset-x-0 bottom-0 top-[7.25rem] z-0 flex items-center overflow-hidden py-10", onWheel: handleProjectWheel, children: [
    /* @__PURE__ */ jsx(
      motion.div,
      {
        ref: projectGridRef,
        animate: projectGridOffset,
        className: "absolute left-0 top-0 z-0 grid auto-rows-[clamp(6rem,10vw,8.5rem)] grid-cols-[repeat(27,clamp(6rem,10vw,8.5rem))] gap-2.5 opacity-100",
        transition: { duration: 0.68, ease: [0.16, 1, 0.3, 1] },
        children: projectTiles.map(({ id, project }) => {
          const projectScreenshots = project ? getProjectScreenshots(project) : [];
          const coverScreenshot = projectScreenshots[0] ?? "";
          const hasScreenshot = Boolean(coverScreenshot);
          const isFocusedProject = Boolean(hasScreenshot && project && project.id === focusedProject.id);
          const visibleScreenshot = isFocusedProject ? focusedScreenshot : coverScreenshot;
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: cn(
                "relative h-full w-full overflow-hidden rounded-md border border-zinc-200 bg-zinc-100",
                hasScreenshot ? isFocusedProject ? "opacity-100 ring-2 ring-zinc-950" : "opacity-100" : "opacity-100"
              ),
              children: [
                project && visibleScreenshot ? /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
                  motion.div,
                  {
                    animate: { opacity: 1, x: 0 },
                    className: "h-full w-full",
                    exit: { opacity: 0, x: -34 },
                    initial: { opacity: 0, x: 34 },
                    transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] },
                    children: /* @__PURE__ */ jsx(ProjectScreenshot, { alt: `${project.title} screenshot`, src: visibleScreenshot })
                  },
                  `${project.id}-${visibleScreenshot}`
                ) }) : null,
                hasScreenshot && !isFocusedProject ? /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 bg-black/76 backdrop-blur-[7px]" }) : null
              ]
            },
            id
          );
        })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.9)_34%,transparent_62%,#ffffff_100%)]" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 mx-auto grid w-full max-w-[1180px] items-center gap-6 px-3 md:grid-cols-[minmax(9rem,0.8fr)_minmax(0,1.25fr)_minmax(14rem,0.95fr)] md:px-8", children: [
      /* @__PURE__ */ jsx("div", { ref: projectSpotlightRef, className: "pointer-events-none mx-auto aspect-square w-[clamp(7rem,18vw,10rem)] rounded-md border border-zinc-950 ring-1 ring-zinc-950" }),
      /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          className: "text-center md:text-left",
          exit: { opacity: 0, y: -20, filter: "blur(8px)" },
          initial: { opacity: 0, y: 20, filter: "blur(8px)" },
          transition: { duration: 0.42, ease: "easeOut" },
          children: [
            /* @__PURE__ */ jsx("h2", { className: "font-rostex-regular mt-2 text-[clamp(2.4rem,7vw,5rem)] uppercase leading-[0.88] text-zinc-950", children: focusedProject.title }),
            /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-[34rem] text-sm font-semibold leading-6 text-zinc-700 md:text-base", children: focusedProject.description }),
            /* @__PURE__ */ jsx("div", { className: "mt-5 flex flex-wrap justify-center gap-2 md:justify-start", children: focusedProject.stack.map((item) => /* @__PURE__ */ jsx("span", { className: "rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs text-zinc-700", children: item }, item)) })
          ]
        },
        focusedProject.id
      ) }),
      /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: focusedScreenshot ? /* @__PURE__ */ jsx(
        motion.a,
        {
          animate: { opacity: 1, x: 0 },
          className: "mx-auto block aspect-[4/3] w-full max-w-[22rem] overflow-hidden rounded-md border border-zinc-300 bg-white",
          exit: { opacity: 0, x: 24 },
          href: focusedProject.project_url || "#",
          initial: { opacity: 0, x: -24 },
          rel: "noreferrer",
          target: focusedProject.project_url ? "_blank" : void 0,
          transition: { duration: 0.42, ease: "easeOut" },
          children: /* @__PURE__ */ jsx(ProjectScreenshot, { alt: `${focusedProject.title} screenshot`, src: focusedScreenshot })
        },
        `${focusedProject.id}-${focusedScreenshot}`
      ) : null })
    ] })
  ] });
}

const $$Projects = createComponent(async ($$result, $$props, $$slots) => {
  const initialContent = await fetchPortfolioContent();
  return renderTemplate`${renderComponent($$result, "PortfolioShell", $$PortfolioShell, { "activeView": "projects", "intro": initialContent.intro, "title": "Projects" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="relative z-0 flex min-h-0 flex-1 overflow-hidden"> ${renderComponent($$result2, "ProjectsPage", ProjectsPage, { "client:load": true, "projects": initialContent.projects, "client:component-hydration": "load", "client:component-path": "@/components/portfolio/ProjectsPage", "client:component-export": "default" })} </div> ` })}`;
}, "C:/Murshida/Career/portfolio/src/pages/projects.astro", void 0);

const $$file = "C:/Murshida/Career/portfolio/src/pages/projects.astro";
const $$url = "/projects";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Projects,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
