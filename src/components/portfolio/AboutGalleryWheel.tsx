import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import type { ActivityItem } from "@/types/content";

const activityCardCount = 8;
const wheelTransition = {
  duration: 0.72,
  ease: [0.16, 1, 0.3, 1] as const
};

const fallbackPanels = [
  "linear-gradient(135deg, #e7eefc 0%, #b9d5e8 44%, #f5f5f5 100%)",
  "linear-gradient(135deg, #f7e5d5 0%, #e4b7b4 46%, #f8f8f8 100%)",
  "linear-gradient(135deg, #dff1e8 0%, #a8cfca 48%, #f7faf8 100%)",
  "linear-gradient(135deg, #ece8f9 0%, #c6badf 48%, #fafafa 100%)"
];

const wheelSlots = [
  { offset: 0, left: 84, top: 50, zIndex: 80 },
  { offset: 1, left: 70, top: 75, zIndex: 70 },
  { offset: 2, left: 50, top: 84, zIndex: 58 },
  { offset: 3, left: 30, top: 75, zIndex: 48 },
  { offset: 4, left: 16, top: 50, zIndex: 40 },
  { offset: -3, left: 30, top: 25, zIndex: 48 },
  { offset: -2, left: 50, top: 16, zIndex: 58 },
  { offset: -1, left: 70, top: 25, zIndex: 70 }
];

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

function getForwardOffset(index: number, activeIndex: number, length: number) {
  const rawOffset = index - activeIndex;
  const wrappedOffset = rawOffset > length / 2 ? rawOffset - length : rawOffset;

  return wrappedOffset < -length / 2 ? wrappedOffset + length : wrappedOffset;
}

function getPlacement(index: number, activeIndex: number, totalItems: number) {
  const offset = getForwardOffset(index, activeIndex, totalItems);
  const normalizedOffset = offset === -4 ? 4 : offset;
  const slot = wheelSlots.find((item) => item.offset === normalizedOffset) ?? wheelSlots[0];

  return {
    left: slot.left,
    top: slot.top,
    zIndex: slot.zIndex
  };
}

function FallbackPanel({ index }: { index: number }) {
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: fallbackPanels[index % fallbackPanels.length] }}>
      <div className="absolute left-[14%] top-[12%] h-[34%] w-[54%] rounded-md bg-white/42" />
      <div className="absolute bottom-0 left-[12%] h-[42%] w-[20%] skew-x-[-12deg] rounded-t-md bg-zinc-950/18" />
      <div className="absolute bottom-0 left-[38%] h-[58%] w-[25%] skew-x-[8deg] rounded-t-md bg-white/36" />
      <div className="absolute bottom-0 right-[10%] h-[46%] w-[23%] skew-x-[12deg] rounded-t-md bg-zinc-950/14" />
    </div>
  );
}

function GalleryImage({ index, item }: { index: number; item: ActivityItem }) {
  const imageUrl = item.image_url.trim();

  if (!imageUrl) {
    return <FallbackPanel index={index} />;
  }

  return <img alt={item.title || "Gallery image"} className="h-full w-full object-cover" src={imageUrl} />;
}

export default function AboutGalleryWheel({ items }: { items: ActivityItem[] }) {
  const galleryItems = useMemo(
    () =>
      Array.from({ length: activityCardCount }, (_, index) => {
        const item = items[index];

        return {
          id: item?.id || `activity-${index + 1}`,
          title: item?.title || `Activity ${index + 1}`,
          image_url: item?.image_url || ""
        };
      }),
    [items]
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const normalizedActiveIndex = wrapIndex(activeIndex, galleryItems.length);
  const activeItem = galleryItems[normalizedActiveIndex];

  return (
    <section
      aria-label="About gallery"
      className="mt-14 rounded-xl border border-white/80 bg-white/65 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.1)] backdrop-blur-lg sm:p-8"
    >
      <div className="grid items-center gap-4 sm:gap-8 sm:justify-center sm:grid-cols-[minmax(0,36rem)_minmax(10rem,22rem)]">
        <div className="relative isolate z-0 h-[34rem] w-full max-w-[36rem] overflow-visible sm:h-[38rem]">
          {galleryItems.map((item, index) => {
            const placement = getPlacement(index, normalizedActiveIndex, galleryItems.length);
            const isActive = index === normalizedActiveIndex;

            return (
              <motion.button
                animate={{
                  filter: "blur(0px)",
                  left: `${placement.left}%`,
                  opacity: 1,
                  rotate: 0,
                  scale: 1,
                  top: `${placement.top}%`,
                  x: "-50%",
                  y: "-50%"
                }}
                aria-label={`Focus ${item.title || "gallery image"}`}
                className="absolute aspect-square w-[clamp(8rem,18vw,11.5rem)] cursor-pointer overflow-hidden rounded-md border border-white bg-zinc-100 shadow-[0_18px_48px_rgba(15,23,42,0.18)] outline-none ring-1 ring-zinc-950/10 focus-visible:ring-2 focus-visible:ring-zinc-950"
                key={item.id}
                onClick={() => setActiveIndex(index)}
                style={{
                  filter: "blur(0px)",
                  left: `${placement.left}%`,
                  opacity: 1,
                  top: `${placement.top}%`,
                  transform: "translate(-50%, -50%)",
                  transformOrigin: "50% 50%",
                  zIndex: placement.zIndex
                }}
                transition={wheelTransition}
                type="button"
              >
                <GalleryImage index={index} item={item} />
                {isActive ? <span className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-zinc-950" /> : null}
              </motion.button>
            );
          })}
        </div>

        <div className="relative z-10 min-w-0 py-2 sm:max-w-[22rem]">
          <AnimatePresence mode="wait">
            <motion.h3
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              aria-live="polite"
              className="font-open-sans-bold text-[clamp(1.35rem,3.4vw,2.45rem)] leading-[1.02] text-zinc-950 [overflow-wrap:anywhere]"
              exit={{ opacity: 0, x: -18, filter: "blur(6px)" }}
              initial={{ opacity: 0, x: 18, filter: "blur(6px)" }}
              key={activeItem.id}
              transition={{ duration: 0.42, ease: "easeOut" }}
            >
              {activeItem.title || "Gallery"}
            </motion.h3>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
