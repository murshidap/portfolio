import { Play } from "lucide-react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

function AchievementCardBody({ imageIndex, item }: { imageIndex: number; item: AchievementItem }) {
  const useUploadedImage = shouldUseImage(item.image_url);

  return (
    <article
      className="flex h-full flex-col overflow-hidden rounded-[1.35rem] p-3 text-white ring-1 ring-white/10"
      style={{
        backgroundColor: "#0a0c10",
        boxShadow: "0 22px 58px rgba(15, 23, 42, 0.34)"
      }}
    >
      <h2 className="mt-8 min-h-[3rem] px-7 text-center text-[clamp(1.08rem,4.4vw,1.38rem)] font-medium uppercase leading-tight tracking-normal [overflow-wrap:anywhere]">
        {item.title || "Achievement"}
      </h2>

      <div className="relative mx-1 mt-3 overflow-hidden rounded-xl bg-white/8">
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
        <span className="pointer-events-none absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/72 text-white shadow-[0_10px_26px_rgba(15,23,42,0.16)] backdrop-blur-sm">
          <Play aria-hidden="true" className="ml-1 h-8 w-8 fill-white text-white" />
        </span>
      </div>

      <span className="mt-auto pb-2" aria-hidden="true" />
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
  const dragStartedRef = useRef(false);

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

    const intervalId = window.setInterval(() => advance(1), autoAdvanceMs);

    return () => window.clearInterval(intervalId);
  }, [achievements.length, advance]);

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
    <section className="relative flex w-full justify-center overflow-visible px-6 py-8 sm:py-10 lg:px-4 lg:py-2">
      <div className="relative flex min-h-[27rem] w-full max-w-[32rem] items-center justify-center overflow-visible">
        <AnimatePresence custom={swipeDirection} initial={false} mode="popLayout">
          <motion.button
            animate={{
              opacity: 1,
              scale: 1,
              x: 0
            }}
            aria-label={`Show next achievement after ${activeAchievement.title || "current achievement"}`}
            className="absolute aspect-[9/13] w-[min(72vw,18rem)] cursor-pointer touch-pan-y focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-zinc-950 sm:w-[18rem]"
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
            <AchievementCardBody imageIndex={activeIndex} item={activeAchievement} />
          </motion.button>
        </AnimatePresence>
      </div>
    </section>
  );
}
