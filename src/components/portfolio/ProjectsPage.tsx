import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type TouchEvent, type WheelEvent } from "react";

import { cn } from "@/lib/utils";
import { getProjectFontFamily } from "@/data/projectFonts";
import type { ProjectItem } from "@/types/content";

function getProjectScreenshots(project: ProjectItem) {
  const urls = [project.image_url, ...(project.screenshot_urls ?? [])].map((url) => url.trim()).filter(Boolean);

  return Array.from(new Set(urls));
}

function ProjectScreenshot({ alt, src }: { alt: string; src: string }) {
  if (src) {
    return <img alt={alt} className="h-full w-full object-cover" src={src} />;
  }

  return null;
}

function getProjectCellIndex(project: ProjectItem, availableCells: number[], usedCells: Set<number>) {
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
const projectWheelQuietDelay = 180;

export default function ProjectsPage({ projects }: { projects: ProjectItem[] }) {
  const [focusedProjectIndex, setFocusedProjectIndex] = useState(0);
  const [projectGridOffset, setProjectGridOffset] = useState({ x: 0, y: 0 });
  const [projectScreenshotCycle, setProjectScreenshotCycle] = useState({ projectId: "", index: 0 });
  const sectionRef = useRef<HTMLElement | null>(null);
  const projectGridRef = useRef<HTMLDivElement | null>(null);
  const projectSpotlightRef = useRef<HTMLDivElement | null>(null);
  const wheelGestureActiveRef = useRef(false);
  const wheelQuietTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    setFocusedProjectIndex(0);
  }, [projects.length]);

  useEffect(() => () => {
    if (wheelQuietTimeoutRef.current !== null) {
      window.clearTimeout(wheelQuietTimeoutRef.current);
    }
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
    const cells: number[] = [];

    for (let row = 4; row <= 10; row += 1) {
      for (let column = 8; column <= 18; column += 1) {
        cells.push(row * projectGridColumns + column);
      }
    }

    return cells;
  }, []);
  const usedProjectCells = new Set<number>();
  const projectByCell = new Map<number, ProjectItem>();
  const projectCellById = new Map<string, number>();
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

    let intervalId: ReturnType<typeof window.setInterval> | null = null;
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
      const focusedCell = grid?.children[focusedProjectCell] as HTMLElement | undefined;

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

  const changeFocusedProject = (direction: -1 | 1) => {
    setFocusedProjectIndex((currentIndex) => Math.min(projects.length - 1, Math.max(0, currentIndex + direction)));
  };

  const handleProjectWheel = (event: WheelEvent<HTMLElement>) => {
    if (projects.length <= 1) {
      return;
    }

    event.preventDefault();

    if (event.deltaY === 0) {
      return;
    }

    if (wheelQuietTimeoutRef.current !== null) {
      window.clearTimeout(wheelQuietTimeoutRef.current);
    }

    wheelQuietTimeoutRef.current = window.setTimeout(() => {
      wheelGestureActiveRef.current = false;
      wheelQuietTimeoutRef.current = null;
    }, projectWheelQuietDelay);

    if (!wheelGestureActiveRef.current) {
      wheelGestureActiveRef.current = true;
      changeFocusedProject(event.deltaY > 0 ? 1 : -1);
    }
  };

  const handleProjectSwipe = (direction: 1 | -1) => {
    if (projects.length <= 1) {
      return;
    }

    changeFocusedProject(direction);
  };

  const handleProjectTouchStart = (event: TouchEvent<HTMLElement>) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? null;
  };

  const handleProjectTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const startY = touchStartYRef.current;
    const endY = event.changedTouches[0]?.clientY;
    touchStartYRef.current = null;

    if (startY === null || endY === undefined || Math.abs(endY - startY) < 48) {
      return;
    }

    handleProjectSwipe(endY < startY ? 1 : -1);
  };

  return (
    <section
      ref={sectionRef}
      className="fixed inset-x-0 bottom-0 top-[7.25rem] z-0 flex items-center overflow-hidden py-10 touch-pan-y"
      onTouchEnd={handleProjectTouchEnd}
      onTouchStart={handleProjectTouchStart}
      onWheel={handleProjectWheel}
    >
      <motion.div
        ref={projectGridRef}
        animate={projectGridOffset}
        className="absolute left-0 top-0 z-0 grid auto-rows-[clamp(6rem,10vw,8.5rem)] grid-cols-[repeat(27,clamp(6rem,10vw,8.5rem))] gap-2.5 opacity-100"
        transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
      >
        {projectTiles.map(({ id, project }) => {
          const projectScreenshots = project ? getProjectScreenshots(project) : [];
          const coverScreenshot = projectScreenshots[0] ?? "";
          const hasScreenshot = Boolean(coverScreenshot);
          const isFocusedProject = Boolean(hasScreenshot && project && project.id === focusedProject.id);
          const visibleScreenshot = isFocusedProject ? focusedScreenshot : coverScreenshot;

          return (
            <div
              key={id}
              className={cn(
                "relative h-full w-full overflow-hidden rounded-md border border-zinc-200 bg-zinc-100",
                hasScreenshot ? (isFocusedProject ? "opacity-100 ring-2 ring-zinc-950" : "opacity-100") : "opacity-100"
              )}
            >
              {project && visibleScreenshot ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${project.id}-${visibleScreenshot}`}
                    animate={{ opacity: 1, x: 0 }}
                    className="h-full w-full"
                    exit={{ opacity: 0, x: -34 }}
                    initial={{ opacity: 0, x: 34 }}
                    transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ProjectScreenshot alt={`${project.title} screenshot`} src={visibleScreenshot} />
                  </motion.div>
                </AnimatePresence>
              ) : null}
              {hasScreenshot && !isFocusedProject ? <div className="pointer-events-none absolute inset-0 bg-black/76 backdrop-blur-[7px]" /> : null}
            </div>
          );
        })}
      </motion.div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1180px] items-center gap-6 px-3 md:grid-cols-[minmax(7rem,0.5fr)_minmax(0,1.5fr)] md:gap-3 md:px-8">
        <div className="flex flex-col items-center gap-3">
          <div ref={projectSpotlightRef} className="pointer-events-none aspect-square w-[clamp(7rem,18vw,10rem)] rounded-md border border-zinc-950 ring-1 ring-zinc-950" />
          <nav aria-label="Project navigation" className="flex items-center gap-2">
            <button
              aria-label="Previous project"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 bg-white/90 text-zinc-950 transition-colors hover:bg-zinc-950 hover:text-white disabled:pointer-events-none disabled:opacity-40"
              disabled={focusedProjectIndex === 0}
              onClick={() => changeFocusedProject(-1)}
              type="button"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            </button>
            <span aria-live="polite" className="min-w-[5.5rem] text-center text-xs font-semibold text-zinc-700">
              Project {focusedProjectIndex + 1} of {projects.length}
            </span>
            <button
              aria-label="Next project"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 bg-white/90 text-zinc-950 transition-colors hover:bg-zinc-950 hover:text-white disabled:pointer-events-none disabled:opacity-40"
              disabled={focusedProjectIndex === projects.length - 1}
              onClick={() => changeFocusedProject(1)}
              type="button"
            >
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </nav>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={focusedProject.id}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            className="relative isolate text-center md:text-left"
            exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            transition={{ duration: 0.42, ease: "easeOut" }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.8)_58%,transparent_100%)] blur-xl"
            />
            <h2
              className="mt-2 text-[clamp(1.9rem,5vw,3.75rem)] leading-[0.88] text-zinc-950"
              style={{ fontFamily: getProjectFontFamily(focusedProject.title_font) }}
            >
              {focusedProject.title}
            </h2>
            <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
              {focusedProject.stack.map((item) => (
                <span key={item} className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs text-zinc-700">
                  {item}
                </span>
              ))}
            </div>
            <p className="mt-4 max-w-[34rem] text-sm font-semibold leading-6 text-zinc-700 md:text-base">{focusedProject.description}</p>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
