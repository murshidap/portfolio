import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import type { AchievementItem } from "@/types/content";

const autoAdvanceMs = 3400;
const maxAchievementCards = 4;
const swipeThreshold = 48;
const cardTransition = { duration: 0.52, ease: [0.16, 1, 0.3, 1] } as const;

const placeholderPanels = [
  "from-slate-200 via-sky-100 to-indigo-200",
  "from-emerald-200 via-cyan-100 to-slate-200",
  "from-amber-200 via-rose-100 to-stone-200",
  "from-violet-200 via-fuchsia-100 to-sky-200"
];

const defaultAchievementImagePath = "/images/achievements/";

function shouldUseImage(imageUrl: string) {
  const trimmedUrl = imageUrl.trim();

  return trimmedUrl && !trimmedUrl.startsWith(defaultAchievementImagePath);
}

function getSwipeDistance(direction: number) {
  return direction > 0 ? 104 : -104;
}

function PlaceholderPanel({ index }: { index: number }) {
  return (
    <div className={`relative aspect-square w-full overflow-hidden bg-gradient-to-br ${placeholderPanels[index]}`}>
      <div className="absolute inset-x-6 top-6 h-20 rounded-md bg-white/55" />
      <div className="absolute bottom-0 left-6 h-36 w-20 skew-x-[-16deg] rounded-t-md bg-zinc-950/55" />
      <div className="absolute bottom-0 left-1/2 h-44 w-28 -translate-x-1/2 skew-x-[-10deg] rounded-t-md bg-white/35" />
      <div className="absolute bottom-0 right-5 h-40 w-24 skew-x-[14deg] rounded-t-md bg-zinc-950/45" />
    </div>
  );
}

function AchievementTitle({
  achievementId,
  onMarqueeDurationChange,
  title
}: {
  achievementId: string;
  onMarqueeDurationChange: (achievementId: string, durationMs: number) => void;
  title: string;
}) {
  const viewportRef = useRef<HTMLHeadingElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [overflowDistance, setOverflowDistance] = useState(0);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const text = textRef.current;

    if (!viewport || !text) {
      return;
    }

    const measureOverflow = () => {
      const viewportStyle = window.getComputedStyle(viewport);
      const horizontalPadding = Number.parseFloat(viewportStyle.paddingLeft) + Number.parseFloat(viewportStyle.paddingRight);
      const visibleWidth = viewport.clientWidth - horizontalPadding;
      const rawDistance = text.getBoundingClientRect().width - visibleWidth;
      const distance = rawDistance > 0 ? Math.ceil(rawDistance) + 2 : 0;
      setOverflowDistance(distance);
      onMarqueeDurationChange(achievementId, distance > 0 ? Math.max(3, distance / 24) * 1000 : 0);
    };

    measureOverflow();

    const resizeObserver = new ResizeObserver(measureOverflow);
    resizeObserver.observe(viewport);
    resizeObserver.observe(text);

    return () => resizeObserver.disconnect();
  }, [achievementId, onMarqueeDurationChange, title]);

  const isOverflowing = overflowDistance > 0;

  return (
    <h2
      ref={viewportRef}
      className="w-[min(78vw,17rem)] max-w-none self-center overflow-hidden whitespace-nowrap px-2 text-center text-sm font-semibold uppercase leading-tight tracking-normal sm:text-base"
    >
      <motion.span
        ref={textRef}
        animate={isOverflowing ? { x: [0, -overflowDistance] } : { x: 0 }}
        className={`block w-max ${isOverflowing ? "" : "mx-auto"}`}
        transition={
          isOverflowing
            ? { duration: Math.max(3, overflowDistance / 24), ease: "linear" }
            : { duration: 0.2 }
        }
      >
        {title}
      </motion.span>
    </h2>
  );
}

function AchievementCardBody({
  imageIndex,
  item,
  onMarqueeDurationChange
}: {
  imageIndex: number;
  item: AchievementItem;
  onMarqueeDurationChange: (achievementId: string, durationMs: number) => void;
}) {
  const useUploadedImage = shouldUseImage(item.image_url);

  return (
    <article className="flex flex-col gap-3 text-white">
      <div className="relative overflow-hidden rounded-md bg-white shadow-[0_14px_32px_rgba(0,0,0,0.16)]">
        {useUploadedImage ? (
          <img
            alt={item.title || "Achievement"}
            className="aspect-square w-full bg-white object-cover"
            loading="eager"
            src={item.image_url}
          />
        ) : (
          <PlaceholderPanel index={imageIndex % placeholderPanels.length} />
        )}
      </div>

      <AchievementTitle achievementId={item.id} onMarqueeDurationChange={onMarqueeDurationChange} title={item.title || "Achievement"} />
    </article>
  );
}

export default function AchievementsIsland({ items }: { items: AchievementItem[] }) {
  const achievements = useMemo(
    () => items.filter((item) => item.title.trim() || item.image_url.trim()).slice(0, maxAchievementCards),
    [items]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(1);
  const [marqueeDurations, setMarqueeDurations] = useState<Record<string, number>>({});
  const dragStartedRef = useRef(false);

  const handleMarqueeDurationChange = useCallback((achievementId: string, durationMs: number) => {
    setMarqueeDurations((current) => current[achievementId] === durationMs ? current : { ...current, [achievementId]: durationMs });
  }, []);

  const advance = useCallback(
    (direction = 1) => {
      if (achievements.length <= 1) {
        return;
      }

      setSwipeDirection(direction);
      setActiveIndex((currentIndex) => {
        if (direction > 0) {
          return (currentIndex + 1) % achievements.length;
        }

        return (currentIndex - 1 + achievements.length) % achievements.length;
      });
    },
    [achievements.length]
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [achievements.length]);

  useEffect(() => {
    if (achievements.length <= 1) {
      return;
    }

    const activeAchievement = achievements[activeIndex];
    const delay = Math.max(autoAdvanceMs, marqueeDurations[activeAchievement.id] ?? 0);
    const timeoutId = window.setTimeout(() => advance(1), delay);

    return () => window.clearTimeout(timeoutId);
  }, [achievements, activeIndex, advance, marqueeDurations]);

  if (achievements.length === 0) {
    return null;
  }

  const activeAchievement = achievements[activeIndex];
  const handleClick = () => {
    if (dragStartedRef.current) {
      dragStartedRef.current = false;
      return;
    }

    advance(1);
  };
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) < swipeThreshold) {
      return;
    }

    advance(info.offset.x < 0 ? 1 : -1);
  };

  return (
    <section className="relative flex w-full justify-center overflow-visible py-2">
      <div className="relative flex min-h-[18rem] w-full max-w-[20rem] items-center justify-center overflow-visible">
        <AnimatePresence custom={swipeDirection} initial={false} mode="popLayout">
          <motion.button
            animate={{
              opacity: 1,
              scale: 1,
              x: 0
            }}
            aria-label={`Show next achievement after ${activeAchievement.title || "current achievement"}`}
            className="absolute w-[min(62vw,13rem)] cursor-pointer touch-pan-y focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-white sm:w-[13rem]"
            drag={achievements.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            exit={{
              opacity: 0,
              scale: 0.98,
              x: -getSwipeDistance(swipeDirection)
            }}
            initial={{
              opacity: 0,
              scale: 0.98,
              x: getSwipeDistance(swipeDirection)
            }}
            key={activeAchievement.id}
            onClick={handleClick}
            onDragStart={() => {
              dragStartedRef.current = true;
            }}
            onDragEnd={handleDragEnd}
            style={{
              transformOrigin: "50% 50%"
            }}
            transition={cardTransition}
            type="button"
          >
            <AchievementCardBody
              imageIndex={activeIndex}
              item={activeAchievement}
              onMarqueeDurationChange={handleMarqueeDurationChange}
            />
          </motion.button>
        </AnimatePresence>
      </div>
    </section>
  );
}
