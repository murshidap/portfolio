import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Mail, Share2 } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type WheelEvent } from "react";

import { ConstellationWidget } from "@/components/portfolio/ConstellationWidget";
import { DEFAULT_THEME_INDEX, PORTFOLIO_THEMES, getThemeStyle } from "@/components/portfolio/themeSystem";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PortfolioContent } from "@/types/content";

export type ViewKey = "home" | "skills" | "projects" | "experience" | "certificates" | "education";

interface PortfolioAppProps {
  initialContent: PortfolioContent;
  initialView?: ViewKey;
}

const views: Array<{ key: ViewKey; label: string }> = [
  { key: "home", label: "Home" },
  { key: "skills", label: "Skills" },
  { key: "projects", label: "Projects" },
  { key: "experience", label: "Experience" },
  { key: "certificates", label: "Certificates" },
  { key: "education", label: "Education" }
];

function getViewHref(view: ViewKey) {
  if (view === "home") {
    return "/";
  }

  if (view === "certificates") {
    return "/certifications";
  }

  return `/${view}`;
}

function GithubIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className + " fill-none stroke-current stroke-[1.8]"}>
      <path d="M9 19c-4.5 1.4-4.5-2.5-6-3m12 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 18 4.77 5.07 5.07 0 0 0 17.91 1S16.73.65 14 2.48a13.38 13.38 0 0 0-6 0C5.27.65 4.09 1 4.09 1A5.07 5.07 0 0 0 4 4.77 5.44 5.44 0 0 0 2.5 8.52c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 8 18.13V22" />
    </svg>
  );
}

function LinkedInIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className + " fill-none stroke-current stroke-[1.8]"}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 1 0-4 0v7h-4v-12h4v2a4 4 0 0 1 2-3Z" />
      <rect x="2" y="9" width="4" height="12" rx="1" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function SocialLinks({ content, className = "" }: { content: PortfolioContent["intro"]; className?: string }) {
  const items = [
    { href: content.github_url, label: "GitHub", icon: <GithubIcon /> },
    { href: content.linkedin_url, label: "LinkedIn", icon: <LinkedInIcon /> },
    { href: `mailto:${content.email}`, label: "Email", icon: <Mail className="h-5 w-5" /> }
  ];

  return (
    <div className={className}>
          {items.map((item) => (
        <a
          key={item.label}
          aria-label={item.label}
          className="text-zinc-500 transition hover:text-zinc-950"
          href={item.href}
          rel="noreferrer"
          target={item.href.startsWith("http") ? "_blank" : undefined}
        >
          {item.icon}
        </a>
      ))}
      <button
        aria-label="Copy website address"
        className="text-zinc-500 transition hover:text-zinc-950"
        onClick={async () => {
          if (typeof window === "undefined") {
            return;
          }

          try {
            await navigator.clipboard.writeText(window.location.href);
          } catch {
            // Ignore clipboard failures to keep the action unobtrusive.
          }
        }}
        type="button"
      >
        <Share2 className="h-5 w-5" />
      </button>
    </div>
  );
}

const skillSlotPoints = [
  { offset: -3, left: -28, top: 72, scale: 0.42, opacity: 0, blur: 8 },
  { offset: -2, left: 8, top: 68, scale: 0.56, opacity: 0.38, blur: 5 },
  { offset: -1, left: 24, top: 48, scale: 0.72, opacity: 0.58, blur: 3 },
  { offset: 0, left: 50, top: 38, scale: 1, opacity: 1, blur: 0 },
  { offset: 1, left: 76, top: 48, scale: 0.72, opacity: 0.58, blur: 3 },
  { offset: 2, left: 92, top: 68, scale: 0.56, opacity: 0.38, blur: 5 },
  { offset: 3, left: 128, top: 72, scale: 0.42, opacity: 0, blur: 8 }
];

const skillSlots = skillSlotPoints
  .filter((point) => point.offset >= -2 && point.offset <= 2)
  .map((point) => ({
    ...point,
    left: `${point.left}%`,
    top: `${point.top}%`,
    zIndex: Math.max(0, 4 - Math.round(Math.abs(point.offset) * 1.5))
  }));

const skillFlowTransition = {
  duration: 1.15,
  ease: [0.16, 1, 0.3, 1] as const
};

const skillAutoScrollDelay = 2400;
const skillWheelIdleDelay = 260;
const skillWheelDeltaThreshold = 24;
const skillManualResumeDelay = 1000;

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

function interpolateValue(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function getSkillPlacement(relativeOffset: number) {
  const firstPoint = skillSlotPoints[0];
  const lastPoint = skillSlotPoints[skillSlotPoints.length - 1];

  if (relativeOffset <= firstPoint.offset) {
    return firstPoint;
  }

  if (relativeOffset >= lastPoint.offset) {
    return lastPoint;
  }

  const nextPointIndex = skillSlotPoints.findIndex((point) => point.offset >= relativeOffset);
  const nextPoint = skillSlotPoints[nextPointIndex];
  const previousPoint = skillSlotPoints[nextPointIndex - 1] ?? nextPoint;
  const progress = (relativeOffset - previousPoint.offset) / (nextPoint.offset - previousPoint.offset || 1);

  return {
    offset: relativeOffset,
    left: interpolateValue(previousPoint.left, nextPoint.left, progress),
    top: interpolateValue(previousPoint.top, nextPoint.top, progress),
    scale: interpolateValue(previousPoint.scale, nextPoint.scale, progress),
    opacity: interpolateValue(previousPoint.opacity, nextPoint.opacity, progress),
    blur: interpolateValue(previousPoint.blur, nextPoint.blur, progress)
  };
}

function getSkillInitials(skill: string) {
  const words = skill
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return (words[0] || skill).slice(0, 2).toUpperCase();
}

function SkillMark({ skill }: { skill: string }) {
  const normalizedSkill = skill.toLowerCase();

  if (normalizedSkill.includes("react")) {
    return (
      <svg aria-hidden="true" className="h-[58%] w-[58%]" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="8" fill="currentColor" />
        <ellipse cx="50" cy="50" fill="none" rx="38" ry="15" stroke="currentColor" strokeWidth="7" />
        <ellipse
          cx="50"
          cy="50"
          fill="none"
          rx="38"
          ry="15"
          stroke="currentColor"
          strokeWidth="7"
          transform="rotate(60 50 50)"
        />
        <ellipse
          cx="50"
          cy="50"
          fill="none"
          rx="38"
          ry="15"
          stroke="currentColor"
          strokeWidth="7"
          transform="rotate(120 50 50)"
        />
      </svg>
    );
  }

  if (normalizedSkill.includes("astro")) {
    return (
      <svg aria-hidden="true" className="h-[62%] w-[62%]" viewBox="0 0 100 100">
        <path d="M50 8 88 78H12L50 8Z" fill="currentColor" opacity="0.95" />
        <path d="M38 80c5 10 19 10 24 0 2 10 8 15 18 15-8 8-22 8-30 1-8 7-22 7-30-1 10 0 16-5 18-15Z" fill="currentColor" />
        <path d="M50 30 63 62H37L50 30Z" fill="rgba(255,255,255,0.32)" />
      </svg>
    );
  }

  if (normalizedSkill.includes("tailwind")) {
    return (
      <svg aria-hidden="true" className="h-[58%] w-[58%]" viewBox="0 0 100 100">
        <path
          d="M24 43c7-20 20-30 38-30 11 0 19 5 25 14-6-4-13-5-21-2-8 3-13 9-17 19-7 20-20 30-38 30-11 0-19-5-25-14 6 4 13 5 21 2 8-3 13-9 17-19Z"
          fill="currentColor"
        />
        <path
          d="M38 61c5-14 15-21 29-21 8 0 15 4 19 11-5-3-10-4-16-2-6 2-10 7-13 14-5 14-15 21-29 21-8 0-15-4-19-11 5 3 10 4 16 2 6-2 10-7 13-14Z"
          fill="rgba(255,255,255,0.34)"
        />
      </svg>
    );
  }

  if (normalizedSkill.includes("supabase")) {
    return (
      <svg aria-hidden="true" className="h-[60%] w-[60%]" viewBox="0 0 100 100">
        <path d="M55 7 18 56h31l-4 37 37-50H51l4-36Z" fill="currentColor" />
        <path d="M51 43h31L45 93l4-37H18L55 7l-4 36Z" fill="rgba(0,0,0,0.12)" />
      </svg>
    );
  }

  return <span className="font-display text-[clamp(2rem,5vw,4rem)] font-bold">{getSkillInitials(skill)}</span>;
}

function SkillTile({ active, skill }: { active: boolean; skill: string }) {
  return (
    <div
      className={cn(
        "group relative grid aspect-square place-items-center overflow-hidden rounded-md border bg-white",
        active
          ? "w-[clamp(7.8rem,22vw,13.5rem)] border-zinc-950 shadow-none"
          : "w-[clamp(6.6rem,18vw,11rem)] border-zinc-300"
      )}
    >
      <div className="absolute inset-[10%] rounded-md border border-zinc-200" />
      <div className="relative z-10 grid h-full w-full place-items-center text-zinc-950">
        <SkillMark skill={skill} />
      </div>
    </div>
  );
}

function SkillsShowcase({ skills }: { skills: string[] }) {
  const skillItems = useMemo(() => skills.map((skill) => skill.trim()).filter(Boolean), [skills]);
  const [activeSkillPosition, setActiveSkillPosition] = useState(0);
  const skillWheelLockRef = useRef(false);
  const skillWheelLockTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const manualResumeTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const autoScrollIntervalRef = useRef<ReturnType<typeof window.setInterval> | null>(null);
  const manualScrollActiveRef = useRef(false);
  const activeSkillIndex = skillItems.length > 0 ? wrapIndex(Math.round(activeSkillPosition), skillItems.length) : 0;
  const activeSkill = skillItems.length > 0 ? skillItems[activeSkillIndex] : "";

  useEffect(() => {
    if (skillItems.length === 0) {
      return;
    }

    setActiveSkillPosition(0);
  }, [skillItems.length]);

  useEffect(() => {
    return () => {
      if (skillWheelLockTimeoutRef.current) {
        window.clearTimeout(skillWheelLockTimeoutRef.current);
      }

      if (manualResumeTimeoutRef.current) {
        window.clearTimeout(manualResumeTimeoutRef.current);
      }

      if (autoScrollIntervalRef.current) {
        window.clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (skillItems.length <= 1) {
      return;
    }

    autoScrollIntervalRef.current = window.setInterval(() => {
      if (!manualScrollActiveRef.current) {
        setActiveSkillPosition((currentPosition) => Math.round(currentPosition) + 1);
      }
    }, skillAutoScrollDelay);

    return () => {
      if (autoScrollIntervalRef.current) {
        window.clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    };
  }, [skillItems.length]);

  if (skillItems.length === 0) {
    return null;
  }

  const centerVirtualIndex = Math.round(activeSkillPosition);
  const visibleSkillPlacements = Array.from({ length: skillItems.length > 1 ? 7 : 1 }, (_, placementIndex) => {
    const virtualIndex = skillItems.length > 1 ? centerVirtualIndex + placementIndex - 3 : centerVirtualIndex;
    const relativeOffset = virtualIndex - activeSkillPosition;
    const placement = getSkillPlacement(relativeOffset);
    const skillIndex = wrapIndex(virtualIndex, skillItems.length);
    const skill = skillItems[skillIndex];

    return {
      key: `${virtualIndex}-${skill}`,
      placement,
      relativeOffset,
      skill
    };
  });

  const handleSkillWheel = (event: WheelEvent<HTMLElement>) => {
    if (skillItems.length <= 1) {
      return;
    }

    event.preventDefault();

    const normalizedDeltaY =
      event.deltaMode === 1 ? event.deltaY * 16 : event.deltaMode === 2 ? event.deltaY * window.innerHeight : event.deltaY;

    if (Math.abs(normalizedDeltaY) < skillWheelDeltaThreshold) {
      return;
    }

    manualScrollActiveRef.current = true;

    if (skillWheelLockTimeoutRef.current) {
      window.clearTimeout(skillWheelLockTimeoutRef.current);
    }

    if (manualResumeTimeoutRef.current) {
      window.clearTimeout(manualResumeTimeoutRef.current);
    }

    skillWheelLockTimeoutRef.current = window.setTimeout(() => {
      skillWheelLockRef.current = false;
      skillWheelLockTimeoutRef.current = null;
    }, skillWheelIdleDelay);

    if (skillWheelLockRef.current) {
      manualResumeTimeoutRef.current = window.setTimeout(() => {
        manualScrollActiveRef.current = false;
        manualResumeTimeoutRef.current = null;
      }, skillManualResumeDelay);
      return;
    }

    skillWheelLockRef.current = true;

    const direction = normalizedDeltaY > 0 ? 1 : -1;
    setActiveSkillPosition((currentPosition) => Math.round(currentPosition) + direction);

    manualResumeTimeoutRef.current = window.setTimeout(() => {
      manualScrollActiveRef.current = false;
      manualResumeTimeoutRef.current = null;
    }, skillManualResumeDelay);
  };

  return (
    <section
      className="mx-auto flex min-h-[72vh] w-full max-w-[1120px] flex-col justify-center overflow-hidden py-8"
      onWheel={handleSkillWheel}
    >
      <div className="relative min-h-[430px] overflow-hidden sm:min-h-[500px]">
        <AnimatePresence initial={false}>
          {visibleSkillPlacements.map(({ key, placement, relativeOffset, skill }) => {
            const active = Math.abs(relativeOffset) < 0.5;

            return (
              <motion.div
                key={key}
                animate={{
                  filter: `blur(${placement.blur}px)`,
                  left: `${placement.left}%`,
                  opacity: placement.opacity,
                  scale: placement.scale,
                  top: `${placement.top}%`,
                  x: "-50%",
                  y: "-50%"
                }}
                className="absolute"
                exit={{
                  filter: "blur(8px)",
                  left: "-20%",
                  opacity: 0,
                  scale: 0.42,
                  top: "72%",
                  x: "-50%",
                  y: "-50%"
                }}
                initial={{
                  filter: "blur(8px)",
                  left: "120%",
                  opacity: 0,
                  scale: 0.42,
                  top: "72%",
                  x: "-50%",
                  y: "-50%"
                }}
                style={{ zIndex: Math.max(0, 4 - Math.round(Math.abs(relativeOffset) * 1.5)) }}
                transition={skillFlowTransition}
              >
                <SkillTile active={active} skill={skill} />
              </motion.div>
            );
          })}
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-[4] flex flex-col items-center text-center sm:bottom-8">
          <AnimatePresence mode="wait">
            <motion.h2
              key={activeSkill}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              aria-live="polite"
              className="font-rostex-regular text-[clamp(2.1rem,6vw,4.2rem)] uppercase leading-[0.95] text-zinc-950"
              exit={{ opacity: 0, y: 22, filter: "blur(8px)" }}
              initial={{ opacity: 0, y: -18, filter: "blur(8px)" }}
              transition={{ duration: 0.48, ease: "easeOut" }}
            >
              {activeSkill}
            </motion.h2>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function getProjectScreenshots(project: PortfolioContent["projects"][number]) {
  const urls = [project.image_url, ...(project.screenshot_urls ?? [])]
    .map((url) => url.trim())
    .filter(Boolean);

  return Array.from(new Set(urls));
}

function ProjectScreenshot({ alt, src }: { alt: string; src: string }) {
  if (src) {
    return <img alt={alt} className="h-full w-full object-cover" src={src} />;
  }

  return null;
}

function getProjectCellIndex(project: PortfolioContent["projects"][number], availableCells: number[], usedCells: Set<number>) {
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

function ProjectsShowcase({ projects }: { projects: PortfolioContent["projects"] }) {
  const [focusedProjectIndex, setFocusedProjectIndex] = useState(0);
  const [projectGridOffset, setProjectGridOffset] = useState({ x: 0, y: 0 });
  const [projectScreenshotCycle, setProjectScreenshotCycle] = useState({ projectId: "", index: 0 });
  const sectionRef = useRef<HTMLElement | null>(null);
  const projectGridRef = useRef<HTMLDivElement | null>(null);
  const projectSpotlightRef = useRef<HTMLDivElement | null>(null);
  const wheelLockRef = useRef(false);
  const wheelLockTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

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
    const cells: number[] = [];

    for (let row = 4; row <= 10; row += 1) {
      for (let column = 8; column <= 18; column += 1) {
        cells.push(row * projectGridColumns + column);
      }
    }

    return cells;
  }, []);
  const usedProjectCells = new Set<number>();
  const projectByCell = new Map<number, PortfolioContent["projects"][number]>();
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

  const handleProjectWheel = (event: WheelEvent<HTMLElement>) => {
    if (projects.length <= 1) {
      return;
    }

    event.preventDefault();

    if (wheelLockRef.current) {
      return;
    }

    if (event.deltaY === 0) {
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

  return (
    <section
      ref={sectionRef}
      className="fixed inset-x-0 bottom-0 top-[7.25rem] z-0 flex items-center overflow-hidden py-10"
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

      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.9)_34%,transparent_62%,#ffffff_100%)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-[1180px] items-center gap-6 px-3 md:grid-cols-[minmax(9rem,0.8fr)_minmax(0,1.25fr)_minmax(14rem,0.95fr)] md:px-8">
        <div
          ref={projectSpotlightRef}
          className="pointer-events-none mx-auto aspect-square w-[clamp(7rem,18vw,10rem)] rounded-md border border-zinc-950 ring-1 ring-zinc-950"
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={focusedProject.id}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            className="text-center md:text-left"
            exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            transition={{ duration: 0.42, ease: "easeOut" }}
          >
            <p className="theme-accent-text text-xs uppercase tracking-[0.24em]">{focusedProject.subtitle}</p>
            <h2 className="font-rostex-regular mt-2 text-[clamp(2.4rem,7vw,5rem)] uppercase leading-[0.88] text-zinc-950">
              {focusedProject.title}
            </h2>
            <p className="mt-4 max-w-[34rem] text-sm font-semibold leading-6 text-zinc-700 md:text-base">{focusedProject.description}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
              {focusedProject.stack.map((item) => (
                <span key={item} className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs text-zinc-700">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {focusedScreenshot ? (
            <motion.a
              key={`${focusedProject.id}-${focusedScreenshot}`}
              animate={{ opacity: 1, x: 0 }}
              className="mx-auto block aspect-[4/3] w-full max-w-[22rem] overflow-hidden rounded-md border border-zinc-300 bg-white"
              exit={{ opacity: 0, x: 24 }}
              href={focusedProject.project_url || "#"}
              initial={{ opacity: 0, x: -24 }}
              rel="noreferrer"
              target={focusedProject.project_url ? "_blank" : undefined}
              transition={{ duration: 0.42, ease: "easeOut" }}
            >
              <ProjectScreenshot alt={`${focusedProject.title} screenshot`} src={focusedScreenshot} />
            </motion.a>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}

function FullSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mx-auto flex min-h-[72vh] w-full max-w-[1120px] flex-col justify-center py-10">
      <h2 className="font-display text-[clamp(2.8rem,8vw,5.5rem)] uppercase tracking-[0.08em] text-zinc-950">{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function renderFullView(view: ViewKey, content: PortfolioContent) {
  switch (view) {
    case "projects":
      return <ProjectsShowcase projects={content.projects} />;
    case "skills":
      return <SkillsShowcase skills={content.intro.skills} />;
    case "experience":
      return (
        <FullSection title="Experience">
          <div className="space-y-4">
            {content.experience.map((item) => (
              <Card key={item.id} className="p-6">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h3 className="font-display text-2xl text-zinc-950">{item.role}</h3>
                    <p className="theme-accent-text mt-1 text-sm uppercase tracking-[0.22em]">{item.company}</p>
                  </div>
                  <p className="text-sm text-zinc-500">{item.duration}</p>
                </div>
                <p className="mt-4 text-sm leading-7 text-zinc-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </FullSection>
      );
    case "certificates":
      return (
        <FullSection title="Certificates">
          <div className="grid gap-4 md:grid-cols-2">
            {content.certificates.map((item) => (
              <Card key={item.id} className="p-6">
                <h3 className="font-display text-2xl text-zinc-950">{item.title}</h3>
                <p className="theme-accent-text mt-2 text-sm uppercase tracking-[0.22em]">{item.issuer}</p>
                <p className="mt-4 text-sm text-zinc-500">{item.year}</p>
              </Card>
            ))}
          </div>
        </FullSection>
      );
    case "education":
      return (
        <FullSection title="Education">
          <div className="space-y-4">
            {content.education.map((item) => (
              <Card key={item.id} className="p-6">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h3 className="font-display text-2xl text-zinc-950">{item.degree}</h3>
                    <p className="theme-accent-text mt-1 text-sm uppercase tracking-[0.22em]">{item.institution}</p>
                  </div>
                  <p className="text-sm text-zinc-500">{item.duration}</p>
                </div>
                <p className="mt-4 text-sm leading-7 text-zinc-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </FullSection>
      );
    default:
      return null;
  }
}

export function PortfolioApp({ initialContent, initialView = "home" }: PortfolioAppProps) {
  const activeView = initialView;
  const content = useMemo(() => initialContent, [initialContent]);
  const themeStyle = useMemo(() => getThemeStyle(PORTFOLIO_THEMES[DEFAULT_THEME_INDEX]), []);

  return (
    <main className="theme-shell relative min-h-screen overflow-hidden text-zinc-950" style={themeStyle}>
      <div className="theme-hero-grid absolute inset-0" />
      <div className="theme-hero-spotlight absolute inset-0 opacity-60" />
      <div className="theme-top-glow absolute inset-0 opacity-40" />
      {activeView === "home" ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="font-faded-display pointer-events-none absolute left-1/2 top-[12%] z-0 flex w-max -translate-x-1/2 flex-col items-center text-center text-[clamp(6rem,22vw,20rem)] font-black leading-[0.82] tracking-[0.02em] text-zinc-950/[0.035]">
            <span className="block text-center">WEB</span>
            <span className="block text-center">DEVELOPER</span>
          </div>
        </div>
      ) : null}

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1600px] flex-col px-5 pb-8 pt-6 md:px-8 lg:px-10 xl:px-16">
        <header className="relative z-30 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-3 text-zinc-800">
          <nav className="flex flex-wrap items-center justify-start gap-6 md:gap-10" aria-label="Primary navigation">
            {views.map((view) => {
              const active = activeView === view.key;
              return (
                <a
                  key={view.key}
                  className={cn(
                    "font-open-sans-light relative pb-1 text-sm font-medium normal-case tracking-normal transition after:absolute after:bottom-0 after:left-0 after:h-px after:bg-current after:transition-[width] after:duration-300 md:text-base",
                    active ? "theme-nav-active after:w-full" : "text-zinc-800 after:w-0 hover:text-zinc-950 hover:after:w-full focus-visible:after:w-full"
                  )}
                  href={getViewHref(view.key)}
                >
                  {view.label}
                </a>
              );
            })}
          </nav>

          <div className="ml-auto flex flex-wrap items-center justify-end gap-4 md:gap-5">
            <SocialLinks className="flex items-center justify-end gap-4 md:gap-5" content={content.intro} />
            <a href={`mailto:${content.intro.email}`}>
              <Button type="button" variant="secondary">
                Connect
              </Button>
            </a>
            <a download href={content.intro.resume_url || "#"}>
              <Button className="min-w-[140px] border-zinc-950 bg-zinc-950 text-sm text-white hover:bg-black">
                <span>Get Resume</span>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeView === "home" ? (
            <motion.div
              key="home"
              animate={{ opacity: 1, y: 0 }}
              className="relative z-0 -mt-8 grid flex-1 items-end gap-8 md:-mt-12 lg:-mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(420px,1fr)]"
              exit={{ opacity: 0, y: 20 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <section className="order-1 relative z-10 min-h-[420px] lg:absolute lg:inset-x-0 lg:top-[4.5rem] lg:min-h-0">
                <div className="pointer-events-none flex justify-center">
                  <div className="relative mt-10 flex w-full max-w-[680px] flex-col items-center md:mt-14 md:max-w-[760px] lg:mt-0 lg:max-w-[860px]">
                    <div className="font-rostex-regular mb-[-1.5rem] translate-y-8 text-center text-[clamp(3.4rem,9vw,8.2rem)] font-black leading-[0.82] tracking-[0.02em] text-zinc-950 lg:mb-[-2.5rem] lg:translate-y-14">
                      <span className="block text-[1.12em]">WEB</span>
                      <span className="relative inline-block">
                        <span className="inline-block">DEVELOPER</span>
                        <ConstellationWidget activeIndex={DEFAULT_THEME_INDEX} themes={PORTFOLIO_THEMES} />
                      </span>
                    </div>
                    <div className="theme-portrait-orb absolute bottom-[8%] left-[10%] right-[10%] top-[6%]" />
                    <div className="relative z-10 -mt-20 w-full md:-mt-24 lg:-mt-32">
                      <div className="pointer-events-none absolute bottom-[6%] left-1/2 h-[64%] w-[58%] -translate-x-1/2 rounded-full bg-black/30 blur-3xl" />
                      <motion.img
                        alt="Murshida portrait"
                        animate={{ opacity: 1, y: 0 }}
                        className="relative z-10 mx-auto w-full max-w-[620px] object-contain grayscale md:max-w-[700px] lg:max-w-[800px]"
                        initial={{ opacity: 0, y: 28 }}
                        src={content.intro.profile_image_url}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className="pointer-events-auto order-3 relative z-20 max-w-[31rem] text-left lg:absolute lg:bottom-4 lg:left-16 xl:bottom-8 xl:left-24"
                initial={{ opacity: 0, x: -22 }}
                transition={{ duration: 0.5, delay: 0.18, ease: "easeOut" }}
              >
                <p className="font-rostex-regular text-[clamp(1.25rem,2.8vw,2.2rem)] uppercase leading-[0.95] tracking-[0.08em] text-zinc-950">
                  {content.intro.name.replace(/\./g, "")}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a download href={content.intro.resume_url || "#"}>
                    <Button disabled={!content.intro.resume_url} type="button">
                      <span>Get Resume</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </a>
                  <a href={`mailto:${content.intro.email}`}>
                    <Button type="button" variant="secondary">
                      Connect
                    </Button>
                  </a>
                </div>
              </motion.div>

              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className="profile-copy-panel pointer-events-auto order-4 relative z-20 max-w-[32rem] text-left lg:absolute lg:bottom-4 xl:bottom-8"
                initial={{ opacity: 0, x: 22 }}
                transition={{ duration: 0.5, delay: 0.24, ease: "easeOut" }}
              >
                <p className="theme-faint-copy text-sm font-light leading-7 tracking-[0.01em] md:text-[0.95rem]">
                  {content.intro.intro}
                </p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key={activeView}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-0 flex min-h-0 flex-1 overflow-hidden"
              exit={{ opacity: 0, y: 20 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {renderFullView(activeView, content)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
