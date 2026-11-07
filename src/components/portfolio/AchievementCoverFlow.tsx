import { Award } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

import type { AchievementItem } from "@/types/content";

const angle = 72;
const gap = 0.62;
const step = 0.2;
const depth = 0.42;
const maximumVisibleDistance = 9;

function getCoverWidth() {
  return Math.round(Math.min(window.innerHeight * 0.48, window.innerWidth * 0.6, 480));
}

function AchievementArtwork({ item, index }: { item: AchievementItem; index: number }) {
  if (item.image_url) {
    return <img alt={item.title || "Achievement"} className="h-full w-full object-cover" loading="lazy" src={item.image_url} />;
  }

  return (
    <div className={`relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br ${index % 2 ? "from-slate-100 via-blue-50 to-slate-300" : "from-stone-100 via-amber-50 to-zinc-300"} p-5 text-zinc-900 sm:p-8`}>
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-zinc-900/10" />
      <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full border border-zinc-900/10" />
      <div className="relative flex items-center justify-between border-b border-zinc-900/20 pb-3">
        <Award aria-hidden="true" className="h-5 w-5 sm:h-7 sm:w-7" />
      </div>
      <div className="relative">
        <p className="text-[0.55rem] uppercase tracking-[0.2em] text-zinc-600 sm:text-xs">Recognition</p>
        <p className="mt-2 line-clamp-3 font-display text-lg leading-tight sm:text-2xl">{item.title || "Achievement"}</p>
      </div>
      <span className="relative self-end text-xs font-medium tabular-nums text-zinc-600 sm:text-sm">Achievement</span>
    </div>
  );
}

export default function AchievementCoverFlow({ items }: { items: AchievementItem[] }) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const scrollDistanceRef = useRef(0);
  const dragRef = useRef<{ pointerId: number; startX: number; startPosition: number; lastX: number; lastTime: number; velocity: number } | null>(null);
  const draggedRef = useRef(false);
  const [targetPosition, setTargetPosition] = useState(0);
  const [position, setPosition] = useState(0);
  const [coverWidth, setCoverWidth] = useState(280);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  const setTarget = useCallback((nextPosition: number) => {
    const boundedPosition = Math.max(0, Math.min(items.length - 1, nextPosition));
    setTargetPosition(boundedPosition);
    const timeline = timelineRef.current;
    const maximumPosition = items.length - 1;
    if (!timeline || maximumPosition <= 0 || scrollDistanceRef.current === 0) {
      return;
    }

    const stickyTop = window.matchMedia("(max-width: 767px)").matches ? 60 : 68;
    const timelineTop = timeline.getBoundingClientRect().top + window.scrollY;
    const targetScroll = timelineTop - stickyTop + (boundedPosition / maximumPosition) * scrollDistanceRef.current;
    window.scrollTo({
      top: targetScroll,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
  }, [items.length]);

  useEffect(() => {
    const updateCoverWidth = () => {
      setCoverWidth(getCoverWidth());
    };

    updateCoverWidth();
    window.addEventListener("resize", updateCoverWidth);
    return () => window.removeEventListener("resize", updateCoverWidth);
  }, []);

  useEffect(() => {
    const timeline = timelineRef.current;
    const sticky = stickyRef.current;
    if (!timeline || !sticky) {
      return;
    }

    let scrollDistance = 0;
    let stackDistance = 0;
    let animationFrame = 0;

    const getStickyTop = () => window.matchMedia("(max-width: 767px)").matches ? 60 : 68;
    const update = () => {
      animationFrame = 0;
      const timelineTop = timeline.getBoundingClientRect().top + window.scrollY;
      const progress = scrollDistance > 0
        ? Math.min(1, Math.max(0, (window.scrollY - timelineTop + getStickyTop()) / scrollDistance))
        : 0;
      setTargetPosition(progress * (items.length - 1));
    };
    const scheduleUpdate = () => {
      if (animationFrame === 0) {
        animationFrame = window.requestAnimationFrame(update);
      }
    };
    const measure = () => {
      const stickyTop = getStickyTop();
      const measuredWidth = getCoverWidth();
      setCoverWidth(measuredWidth);
      scrollDistance = Math.max(0, (items.length - 1) * measuredWidth * 0.65);
      stackDistance = window.innerHeight;
      scrollDistanceRef.current = scrollDistance;
      sticky.style.top = `${stickyTop}px`;
      sticky.style.height = `calc(100svh - ${stickyTop}px)`;
      timeline.style.height = `${window.innerHeight - stickyTop + scrollDistance + stackDistance}px`;
      const gallerySection = timeline.closest<HTMLElement>("#gallery");
      if (gallerySection) {
        gallerySection.style.setProperty("--gallery-stack-distance", `${stackDistance}px`);
        gallerySection.dataset.enhanced = "true";
        const certificatesSection = gallerySection.nextElementSibling;
        if (certificatesSection instanceof HTMLElement && certificatesSection.id === "certificates") {
          certificatesSection.style.setProperty("--gallery-stack-distance", `${stackDistance}px`);
          certificatesSection.dataset.galleryStack = "true";
        }
      }
      timeline.dataset.enhanced = "true";
      update();
    };

    measure();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", measure);
      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame);
      }
      delete timeline.dataset.enhanced;
      const gallerySection = timeline.closest<HTMLElement>("#gallery");
      if (gallerySection) {
        delete gallerySection.dataset.enhanced;
        gallerySection.style.removeProperty("--gallery-stack-distance");
        const certificatesSection = gallerySection.nextElementSibling;
        if (certificatesSection instanceof HTMLElement && certificatesSection.id === "certificates") {
          delete certificatesSection.dataset.galleryStack;
          certificatesSection.style.removeProperty("--gallery-stack-distance");
        }
      }
      scrollDistanceRef.current = 0;
      timeline.style.removeProperty("height");
      sticky.style.removeProperty("top");
      sticky.style.removeProperty("height");
    };
  }, [items.length]);

  useEffect(() => {
    let frameId = 0;
    let previousTime = performance.now();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      positionRef.current = targetPosition;
      setPosition(targetPosition);
      return;
    }

    const animate = (time: number) => {
      const difference = targetPosition - positionRef.current;
      if (Math.abs(difference) < 0.0005) {
        positionRef.current = targetPosition;
        setPosition(targetPosition);
        return;
      }

      const deltaTime = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      positionRef.current += difference * (1 - Math.exp(-deltaTime * 13));
      setPosition(positionRef.current);
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [targetPosition]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || items.length < 2) {
      return;
    }

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startPosition: positionRef.current,
      lastX: event.clientX,
      lastTime: performance.now(),
      velocity: 0
    };
    draggedRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - drag.startX;
    if (Math.abs(deltaX) > 4) {
      draggedRef.current = true;
      const nextPosition = Math.max(-0.4, Math.min(items.length - 0.6, drag.startPosition - deltaX / (coverWidth * step * 2.2)));
      const now = performance.now();
      drag.velocity = (event.clientX - drag.lastX) / Math.max(now - drag.lastTime, 1);
      drag.lastX = event.clientX;
      drag.lastTime = now;
      setTargetPosition(Math.max(0, Math.min(items.length - 1, nextPosition)));
    }
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    if (draggedRef.current) {
      setTarget(Math.round(positionRef.current - (drag.velocity * 180) / (coverWidth * step * 2.2)));
      window.setTimeout(() => {
        draggedRef.current = false;
      }, 0);
    }
    dragRef.current = null;
  };

  const handleCardClick = (index: number) => {
    if (draggedRef.current) {
      return;
    }

    if (index === Math.round(targetPosition)) {
      setFlippedIndex((current) => current === index ? null : index);
      return;
    }

    setFlippedIndex(null);
    setTarget(index);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      setFlippedIndex(null);
      setTarget(targetPosition + (event.key === "ArrowRight" ? 1 : -1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      setFlippedIndex((current) => current === Math.round(targetPosition) ? null : Math.round(targetPosition));
    } else if (event.key === "Escape") {
      setFlippedIndex(null);
    }
  };

  if (items.length === 0) {
    return (
      <section className="flex min-h-[72vh] w-full items-center justify-center bg-black text-sm text-white/60">
        No achievements to display yet.
      </section>
    );
  }

  const activeIndex = Math.max(0, Math.min(items.length - 1, Math.round(position)));
  const activeAchievement = items[activeIndex];

  return (
    <section className="relative w-full bg-black text-[#f4f4f5]">
      <div className="achievement-flow relative w-full" ref={timelineRef}>
        <div className="achievement-flow-sticky relative flex w-full flex-col items-center justify-center overflow-hidden bg-black px-4 py-10 sm:px-8" ref={stickyRef}>
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[44%] h-[80vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(120,90,200,.22),rgba(120,90,200,.06)_55%,transparent)]" />

          <div
            ref={flowRef}
            aria-label="Achievement cover flow. Use arrow keys, scroll, or drag to browse. Press Enter to view details."
            className="relative z-10 mt-12 h-[62vh] min-h-[20rem] w-full cursor-grab touch-pan-y [perspective-origin:50%_42%] active:cursor-grabbing"
            onKeyDown={handleKeyDown}
            onPointerCancel={handlePointerUp}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            role="region"
            style={{ perspective: `${coverWidth * 3.4}px`, perspectiveOrigin: "50% 42%" }}
            tabIndex={0}
          >
            {items.map((item, index) => {
              const distance = index - position;
              const absoluteDistance = Math.abs(distance);
              if (absoluteDistance > maximumVisibleDistance) {
                return null;
              }

              const direction = Math.sign(distance);
              const x = absoluteDistance < 1 ? distance * gap : direction * (gap + (absoluteDistance - 1) * step);
              const rotation = absoluteDistance < 1 ? -distance * angle : -direction * angle;
              const z = -Math.min(absoluteDistance, 1) * depth;
              const isFlipped = flippedIndex === index;

              return (
                <div
                  aria-label={item.title}
                  className="group absolute left-1/2 top-[42%] [transform-style:preserve-3d]"
                  key={item.id}
                  style={{
                    width: coverWidth,
                    height: coverWidth,
                    marginLeft: -coverWidth / 2,
                    marginTop: -coverWidth / 2,
                    zIndex: isFlipped ? 999 : 500 - Math.round(absoluteDistance * 10),
                    transform: `translate3d(${x * coverWidth}px, 0, ${z * coverWidth + (isFlipped ? coverWidth * 0.55 : 0)}px) rotateY(${rotation + (isFlipped ? 180 : 0)}deg)`,
                    transition: isFlipped ? "transform 620ms cubic-bezier(0.65, 0, 0.35, 1)" : "none"
                  }}
                >
                  <button
                    aria-label={`View ${item.title} achievement details`}
                    className="absolute inset-0 overflow-hidden rounded-sm bg-black text-left shadow-[0_30px_80px_rgba(0,0,0,0.5)] [backface-visibility:hidden]"
                    onClick={() => handleCardClick(index)}
                    style={{ width: coverWidth, height: coverWidth }}
                    type="button"
                  >
                    <AchievementArtwork index={index} item={item} />
                  </button>

                  <div
                    aria-hidden={!isFlipped}
                    className="absolute inset-0 flex flex-col overflow-hidden rounded-sm bg-[#fbfbfc] text-zinc-900 shadow-[0_30px_80px_rgba(0,0,0,0.5)] [backface-visibility:hidden]"
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    <div className="flex h-[24%] flex-col justify-center border-b border-[#7489a1] bg-[linear-gradient(#cdd8e4,#a7b8cb_50%,#97abc1_51%,#adbed0)] px-[6%]">
                      <p className="truncate text-base font-bold text-white [text-shadow:0_-1px_0_rgba(40,60,90,.55)] sm:text-xl">{item.title}</p>
                      <p className="truncate text-xs text-[#41505f] sm:text-sm">Achievement</p>
                    </div>
                    <div className="flex flex-1 flex-col justify-center gap-3 px-[7%] text-sm sm:gap-4 sm:text-base">
                      <p className="text-center text-zinc-600">A moment worth celebrating.</p>
                      <button
                        aria-label="Close achievement details"
                        className="mt-2 self-center rounded-full border border-zinc-300 px-4 py-2 text-xs font-medium transition hover:bg-zinc-100"
                        onClick={() => setFlippedIndex(null)}
                        type="button"
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-full mt-[2px] overflow-hidden opacity-40"
                    style={{
                      width: coverWidth,
                      height: coverWidth,
                      maskImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0.9), transparent 70%)",
                      WebkitMaskImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0.9), transparent 70%)",
                      visibility: isFlipped ? "hidden" : "visible"
                    }}
                  >
                    <div className="h-full w-full scale-y-[-1] overflow-hidden rounded-sm bg-black">
                      <AchievementArtwork index={index} item={item} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative z-10 -mt-2 flex w-full max-w-[min(440px,90vw)] flex-col items-center gap-3 text-center">
            <div>
              <h2 aria-live="polite" className="text-lg font-semibold sm:text-xl">{activeAchievement.title}</h2>
            </div>
            <div aria-label={`Achievement ${activeIndex + 1} of ${items.length}`} className="mt-1 flex items-center gap-2">
              {items.map((item, index) => (
                <button
                  aria-current={index === activeIndex ? "true" : undefined}
                  aria-label={`Go to ${item.title}`}
                  className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-6 bg-white" : "w-1.5 bg-white/35 hover:bg-white/70"}`}
                  key={item.id}
                  onClick={() => {
                    setFlippedIndex(null);
                    setTarget(index);
                  }}
                  type="button"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
