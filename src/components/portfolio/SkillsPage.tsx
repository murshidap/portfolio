import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState, type TouchEvent } from "react";

import { cn } from "@/lib/utils";
import type { SkillItem } from "@/types/content";

const skillSlotPoints = [
  { offset: -3, left: -28, top: 72, scale: 0.42, opacity: 0, blur: 8 },
  { offset: -2, left: 8, top: 68, scale: 0.56, opacity: 0.38, blur: 5 },
  { offset: -1, left: 24, top: 48, scale: 0.72, opacity: 0.58, blur: 3 },
  { offset: 0, left: 50, top: 38, scale: 1, opacity: 1, blur: 0 },
  { offset: 1, left: 76, top: 48, scale: 0.72, opacity: 0.58, blur: 3 },
  { offset: 2, left: 92, top: 68, scale: 0.56, opacity: 0.38, blur: 5 },
  { offset: 3, left: 128, top: 72, scale: 0.42, opacity: 0, blur: 8 }
];

const mobileSkillSlotPoints = [
  { offset: -3, left: -38, top: 58, scale: 0.42, opacity: 0, blur: 8 },
  { offset: -2, left: 1, top: 53, scale: 0.56, opacity: 0.38, blur: 5 },
  { offset: -1, left: 18, top: 45, scale: 0.72, opacity: 0.58, blur: 3 },
  { offset: 0, left: 50, top: 38, scale: 1, opacity: 1, blur: 0 },
  { offset: 1, left: 82, top: 45, scale: 0.72, opacity: 0.58, blur: 3 },
  { offset: 2, left: 99, top: 53, scale: 0.56, opacity: 0.38, blur: 5 },
  { offset: 3, left: 138, top: 58, scale: 0.42, opacity: 0, blur: 8 }
];

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

function getSkillPlacement(relativeOffset: number, isMobile: boolean) {
  const slotPoints = isMobile ? mobileSkillSlotPoints : skillSlotPoints;
  const firstPoint = slotPoints[0];
  const lastPoint = slotPoints[slotPoints.length - 1];

  if (relativeOffset <= firstPoint.offset) {
    return firstPoint;
  }

  if (relativeOffset >= lastPoint.offset) {
    return lastPoint;
  }

  const nextPointIndex = slotPoints.findIndex((point) => point.offset >= relativeOffset);
  const nextPoint = slotPoints[nextPointIndex];
  const previousPoint = slotPoints[nextPointIndex - 1] ?? nextPoint;
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

function SkillMark({ skill }: { skill: SkillItem }) {
  if (skill.icon_url) {
    return <img alt="" className="h-[62%] w-[62%] object-contain" src={skill.icon_url} />;
  }

  const normalizedSkill = skill.title.toLowerCase();

  if (normalizedSkill.includes("react")) {
    return (
      <svg aria-hidden="true" className="h-[58%] w-[58%]" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="8" fill="currentColor" />
        <ellipse cx="50" cy="50" fill="none" rx="38" ry="15" stroke="currentColor" strokeWidth="7" />
        <ellipse cx="50" cy="50" fill="none" rx="38" ry="15" stroke="currentColor" strokeWidth="7" transform="rotate(60 50 50)" />
        <ellipse cx="50" cy="50" fill="none" rx="38" ry="15" stroke="currentColor" strokeWidth="7" transform="rotate(120 50 50)" />
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
        <path d="M24 43c7-20 20-30 38-30 11 0 19 5 25 14-6-4-13-5-21-2-8 3-13 9-17 19-7 20-20 30-38 30-11 0-19-5-25-14 6 4 13 5 21 2 8-3 13-9 17-19Z" fill="currentColor" />
        <path d="M38 61c5-14 15-21 29-21 8 0 15 4 19 11-5-3-10-4-16-2-6 2-10 7-13 14-5 14-15 21-29 21-8 0-15-4-19-11 5 3 10 4 16 2 6-2 10-7 13-14Z" fill="rgba(255,255,255,0.34)" />
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

  return <span className="font-display text-[clamp(2rem,5vw,4rem)] font-bold">{getSkillInitials(skill.title)}</span>;
}

function SkillTile({ active, skill }: { active: boolean; skill: SkillItem }) {
  return (
    <div
      className={cn(
        "group relative grid aspect-square place-items-center overflow-hidden rounded-md border bg-white",
        active ? "w-[clamp(7.8rem,22vw,13.5rem)] border-zinc-950 shadow-none" : "w-[clamp(6.6rem,18vw,11rem)] border-zinc-300"
      )}
    >
      <div className="absolute inset-[10%] rounded-md border border-zinc-200" />
      <div className="relative z-10 grid h-full w-full place-items-center text-zinc-950">
        <SkillMark skill={skill} />
      </div>
    </div>
  );
}

function SkillsTimeline({ skills }: { skills: SkillItem[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const skillItems = useMemo(
    () => skills.filter((skill) => skill.title.trim() || skill.icon_url.trim()),
    [skills]
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const sticky = section.querySelector<HTMLElement>("[data-skills-sticky]");
    const viewport = section.querySelector<HTMLElement>("[data-skills-viewport]");
    const track = section.querySelector<HTMLElement>("[data-skills-track]");
    if (!sticky || !viewport || !track) {
      return;
    }

    let travelDistance = 0;
    let scrollDistance = 0;
    let animationFrame = 0;
    const getStickyTop = () => (window.matchMedia("(max-width: 767px)").matches ? 60 : 68);

    const update = () => {
      animationFrame = 0;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const progress = scrollDistance > 0
        ? Math.min(1, Math.max(0, (window.scrollY - sectionTop + getStickyTop()) / scrollDistance))
        : 0;
      track.style.transform = `translate3d(${-travelDistance * progress}px, 0, 0)`;
    };

    const measure = () => {
      track.style.transform = "translate3d(0, 0, 0)";
      travelDistance = Math.max(0, track.scrollWidth - viewport.clientWidth);
      scrollDistance = travelDistance * 0.65;
      sticky.style.height = `calc(100svh - ${getStickyTop()}px)`;
      section.style.setProperty("--skills-scroll-height", `${sticky.offsetHeight + scrollDistance}px`);
      section.dataset.enhanced = "true";
      update();
    };

    const requestUpdate = () => {
      if (animationFrame === 0) {
        animationFrame = window.requestAnimationFrame(update);
      }
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(viewport);
    resizeObserver.observe(track);
    measure();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", measure);
      resizeObserver.disconnect();
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [skillItems.length]);

  if (skillItems.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} aria-label="Skills" className="skills-scroll-section relative w-full">
      <div className="skills-scroll-sticky flex w-full flex-col justify-center overflow-hidden" data-skills-sticky>
        <div className="skills-scroll-viewport relative w-full flex-1 overflow-hidden" data-skills-viewport>
          <div className="skills-scroll-track relative flex h-full items-center" data-skills-track>
            {skillItems.map((skill) => (
              <article className="skills-scroll-item flex h-full w-[min(72vw,20rem)] shrink-0 flex-col items-start justify-center" key={skill.id}>
                <SkillTile active skill={skill} />
                <h2 className="mt-6 max-w-[18rem] font-baserona-bold text-[clamp(2rem,5vw,4rem)] leading-[0.95] text-zinc-950">
                  {skill.title}
                </h2>
              </article>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .skills-scroll-section[data-enhanced] { height: var(--skills-scroll-height); }
        .skills-scroll-sticky { height: auto; }
        .skills-scroll-section[data-enhanced] .skills-scroll-sticky { position: sticky; top: 4.25rem; height: calc(100svh - 4.25rem); }
        .skills-scroll-viewport { min-height: 26rem; }
        .skills-scroll-track { gap: clamp(2rem, 7vw, 7rem); width: max-content; min-width: 100%; padding: 0 max(2rem, calc((100% - min(72vw, 20rem)) / 2)); will-change: transform; }
        .skills-scroll-section:not([data-enhanced]) .skills-scroll-track { align-items: flex-start; flex-direction: column; gap: 2rem; height: auto; min-width: 0; width: 100%; padding: 2rem max(1.25rem, calc((100vw - 1180px) / 2)); transform: none !important; }
        .skills-scroll-section:not([data-enhanced]) .skills-scroll-viewport { overflow: visible; }
        .skills-scroll-section:not([data-enhanced]) .skills-scroll-item { width: min(100%, 20rem); }
        @media (max-width: 767px) {
          .skills-scroll-section[data-enhanced] .skills-scroll-sticky { top: 3.75rem; height: calc(100svh - 3.75rem); }
          .skills-scroll-viewport { min-height: 22rem; }
        }
        @media (prefers-reduced-motion: reduce) { .skills-scroll-track { will-change: auto; } }
      `}</style>
    </section>
  );
}

export default function SkillsPage({ skills }: { skills: SkillItem[] }) {
  return <SkillsTimeline skills={skills} />;
}

function LegacySkillsPage({ skills }: { skills: SkillItem[] }) {
  const skillItems = useMemo(
    () => skills.filter((skill) => skill.title.trim() || skill.icon_url.trim()),
    [skills]
  );
  const [activeSkillPosition, setActiveSkillPosition] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const skillWheelLockRef = useRef(false);
  const skillWheelLockTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const manualResumeTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const autoScrollIntervalRef = useRef<ReturnType<typeof window.setInterval> | null>(null);
  const manualScrollActiveRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
  const activeSkillIndex = skillItems.length > 0 ? wrapIndex(Math.round(activeSkillPosition), skillItems.length) : 0;
  const activeSkill = skillItems.length > 0 ? skillItems[activeSkillIndex] : null;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const updateMobileLayout = () => setIsMobile(mediaQuery.matches);

    updateMobileLayout();
    mediaQuery.addEventListener("change", updateMobileLayout);

    return () => mediaQuery.removeEventListener("change", updateMobileLayout);
  }, []);

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

  const handleSkillWheel = useCallback((event: WheelEvent) => {
    if (skillItems.length <= 1) {
      return;
    }

    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) {
      return;
    }

    event.preventDefault();

    const normalizedDeltaX =
      event.deltaMode === 1 ? event.deltaX * 16 : event.deltaMode === 2 ? event.deltaX * window.innerWidth : event.deltaX;

    if (Math.abs(normalizedDeltaX) < skillWheelDeltaThreshold) {
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
    setActiveSkillPosition((currentPosition) => Math.round(currentPosition) + (normalizedDeltaX > 0 ? 1 : -1));

    manualResumeTimeoutRef.current = window.setTimeout(() => {
      manualScrollActiveRef.current = false;
      manualResumeTimeoutRef.current = null;
    }, skillManualResumeDelay);
  }, [skillItems.length]);

  const handleSkillTouchStart = (event: TouchEvent<HTMLElement>) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? null;
  };

  const handleSkillTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const startY = touchStartYRef.current;
    const endY = event.changedTouches[0]?.clientY;
    touchStartYRef.current = null;

    if (skillItems.length <= 1 || startY === null || endY === undefined || Math.abs(endY - startY) < 48) {
      return;
    }

    manualScrollActiveRef.current = true;
    if (manualResumeTimeoutRef.current) {
      window.clearTimeout(manualResumeTimeoutRef.current);
    }

    setActiveSkillPosition((currentPosition) => Math.round(currentPosition) + (endY < startY ? 1 : -1));
    manualResumeTimeoutRef.current = window.setTimeout(() => {
      manualScrollActiveRef.current = false;
      manualResumeTimeoutRef.current = null;
    }, skillManualResumeDelay);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    section.addEventListener("wheel", handleSkillWheel, { passive: false });

    return () => section.removeEventListener("wheel", handleSkillWheel);
  }, [handleSkillWheel]);

  if (skillItems.length === 0) {
    return null;
  }

  const centerVirtualIndex = Math.round(activeSkillPosition);
  const visibleSkillPlacements = Array.from({ length: skillItems.length > 1 ? 7 : 1 }, (_, placementIndex) => {
    const virtualIndex = skillItems.length > 1 ? centerVirtualIndex + placementIndex - 3 : centerVirtualIndex;
    const relativeOffset = virtualIndex - activeSkillPosition;
    const placement = getSkillPlacement(relativeOffset, isMobile);
    const skillIndex = wrapIndex(virtualIndex, skillItems.length);
    const skill = skillItems[skillIndex];

    return {
      key: `${virtualIndex}-${skill.id}-${skill.title}`,
      placement,
      relativeOffset,
      skill
    };
  });

  return (
    <section
      ref={sectionRef}
      className="flex min-h-[72vh] w-full flex-col justify-center overflow-hidden py-8"
      onTouchEnd={handleSkillTouchEnd}
      onTouchStart={handleSkillTouchStart}
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
                exit={{ filter: "blur(8px)", left: "-20%", opacity: 0, scale: 0.42, top: "72%", x: "-50%", y: "-50%" }}
                initial={{ filter: "blur(8px)", left: "120%", opacity: 0, scale: 0.42, top: "72%", x: "-50%", y: "-50%" }}
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
              key={activeSkill?.id ?? "empty-skill"}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              aria-live="polite"
              className="font-baserona-bold text-[clamp(2.1rem,6vw,4.2rem)] leading-[0.95] text-zinc-950"
              exit={{ opacity: 0, y: 22, filter: "blur(8px)" }}
              initial={{ opacity: 0, y: -18, filter: "blur(8px)" }}
              transition={{ duration: 0.48, ease: "easeOut" }}
            >
              {activeSkill?.title}
            </motion.h2>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
