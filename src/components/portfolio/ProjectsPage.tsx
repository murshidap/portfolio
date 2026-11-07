import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { getProjectCardForeground, normalizeProjectCardColor } from "@/data/projectColors";
import type { ProjectItem } from "@/types/content";

function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className = ""
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ProjectCardItem({
  project,
  index,
  totalCards
}: {
  project: ProjectItem;
  index: number;
  totalCards: number;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const { scrollYProgress: entranceProgress } = useScroll({
    target: containerRef,
    offset: ["start end", `start ${72 + index * 22}px`]
  });

  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [1, 1] : [1, targetScale]
  );
  const entranceDirection = index % 3 === 1 ? -1 : index % 3 === 2 ? 1 : 0;
  const entranceRotation = index % 3 === 2 ? 7 : -7;
  const entranceX = useTransform(
    entranceProgress,
    [0, 1],
    shouldReduceMotion || index === 0 ? [0, 0] : [entranceDirection * 64, 0]
  );
  const entranceY = useTransform(
    entranceProgress,
    [0, 1],
    shouldReduceMotion || index === 0 ? [0, 0] : [48, 0]
  );
  const entranceRotate = useTransform(
    entranceProgress,
    [0, 1],
    shouldReduceMotion || index === 0 ? [0, 0] : [entranceRotation, 0]
  );
  const images = [project.image_url, ...(project.screenshot_urls ?? [])].filter(Boolean);
  const visibleImageIndex = Math.min(activeImageIndex, Math.max(images.length - 1, 0));
  const activeImage = images[visibleImageIndex];

  return (
    <motion.div
      ref={containerRef}
      style={{
        scale,
        x: entranceX,
        y: entranceY,
        rotate: entranceRotate,
        top: `calc(clamp(4.5rem, 9vh, 6.5rem) + ${index * 22}px)`,
        transformOrigin: "top center",
        zIndex: index + 1,
        backgroundColor: normalizeProjectCardColor(project.card_color),
        color: getProjectCardForeground(project.card_color)
      }}
      className="sticky mx-auto w-full max-w-4xl rounded-xl border-2 border-[#D7E2EA] p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] sm:rounded-2xl sm:p-5 md:p-6"
    >
        {/* Top row */}
        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 md:mb-5">
          <span className="font-bold text-[clamp(1.75rem,3.5vw,3rem)] leading-none tracking-[-0.05em] select-none tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="text-base sm:text-lg md:text-xl font-semibold leading-tight tracking-[-0.03em]">
            {project.title}
          </h3>
        </div>

        {/* Project cover and details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 md:gap-4 w-full">
          <div>
            <div className="overflow-hidden rounded-lg sm:rounded-xl w-full bg-[#141414] border border-[#D7E2EA]/15 shadow-inner aspect-[16/10]">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={`${project.title} image ${visibleImageIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              ) : null}
            </div>
            <div className="mt-2 flex items-center justify-between text-current">
              <button
                aria-label={`Previous image for ${project.title}`}
                className="grid h-8 w-8 place-items-center rounded-md border border-current/20 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={visibleImageIndex === 0}
                onClick={() => setActiveImageIndex((current) => Math.max(current - 1, 0))}
                type="button"
              >
                <ChevronLeft aria-hidden="true" className="h-4 w-4" />
              </button>
              <span aria-live="polite" className="text-xs tabular-nums text-current/70">
                {images.length ? `${visibleImageIndex + 1} / ${images.length}` : "0 / 0"}
              </span>
              <button
                aria-label={`Next image for ${project.title}`}
                className="grid h-8 w-8 place-items-center rounded-md border border-current/20 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={visibleImageIndex >= images.length - 1}
                onClick={() => setActiveImageIndex((current) => Math.min(current + 1, images.length - 1))}
                type="button"
              >
                <ChevronRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-3 text-sm leading-relaxed text-current/80 sm:py-1">
            {project.description ? <p className="whitespace-pre-line">{project.description}</p> : null}
            {project.stack.length ? (
              <ul aria-label="Technology stack" className="flex flex-wrap gap-2">
                {project.stack.map((technology) => (
                  <li
                    className="rounded-full border border-current/20 px-2.5 py-1 text-xs"
                    key={technology}
                  >
                    {technology}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
    </motion.div>
  );
}

export default function ProjectsPage({ projects = [] }: { projects?: ProjectItem[] }) {
  const displayProjects = projects;

  return (
    <div
      className="relative z-10 w-full bg-white pt-6 sm:pt-10 md:pt-16 pb-20 sm:pb-28 md:pb-36 px-4 sm:px-6 md:px-10 text-zinc-950 font-sans"
    >
      {/* 3 Sticky-Stacking Project Cards */}
      <div className="relative flex w-full flex-col gap-4 sm:gap-5 md:gap-6">
        {displayProjects.map((project, index) => (
          <ProjectCardItem
            key={project.id}
            project={project}
            index={index}
            totalCards={displayProjects.length}
          />
        ))}
        <div aria-hidden="true" className="h-[100svh] shrink-0" />
      </div>
    </div>
  );
}
