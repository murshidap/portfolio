import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import type { PortfolioTheme } from "@/components/portfolio/themeSystem";

type ThemeRailProps = {
  activeIndex: number;
  onAdvance: () => void;
  themes: PortfolioTheme[];
};

export function ConstellationWidget({ activeIndex, onAdvance, themes }: ThemeRailProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const activeTheme = themes[activeIndex];
  const accent = activeTheme.colors[3];
  const accentSoft = activeTheme.colors[4];
  const startX = 2;
  const endX = 98;
  const span = endX - startX;

  return (
    <motion.button
      animate={
        prefersReducedMotion
          ? { opacity: isHovered ? 0.94 : 0.56 }
          : {
              opacity: isHovered ? 0.94 : 0.56,
              y: [0, -2, 0]
            }
      }
      aria-label="Cycle portfolio color theme"
      className="pointer-events-auto absolute left-0 top-[calc(100%+0.55rem)] z-20 h-9 w-full appearance-none bg-transparent p-0 outline-none md:top-[calc(100%+0.7rem)]"
      onBlur={() => setIsHovered(false)}
      onClick={onAdvance}
      onFocus={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onHoverStart={() => setIsHovered(true)}
      style={{
        filter: `drop-shadow(0 0 18px ${accent}22)`
      }}
      transition={{
        duration: prefersReducedMotion ? 0.16 : 4.8,
        ease: "easeInOut",
        repeat: prefersReducedMotion ? 0 : Number.POSITIVE_INFINITY
      }}
      type="button"
      whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
    >
      <div aria-hidden="true" className="relative h-full w-full">
        <motion.div
          animate={{
            opacity: isHovered ? 0.72 : 0.42
          }}
          className="absolute top-1/2 h-px -translate-y-1/2 rounded-full"
          style={{
            left: `${startX}%`,
            right: `${100 - endX}%`,
            backgroundColor: accentSoft,
            filter: `drop-shadow(0 0 8px ${accentSoft}55)`
          }}
          transition={{ duration: prefersReducedMotion ? 0.16 : 0.4, ease: "easeOut" }}
        />

        {themes.map((theme, index) => {
          const x = startX + (span * index) / (themes.length - 1);
          const active = index === activeIndex;

          return (
            <motion.div
              key={theme.id}
              animate={
                prefersReducedMotion
                  ? { opacity: active ? 1 : isHovered ? 0.72 : 0.5, scale: 1 }
                  : {
                      opacity: active ? [0.88, 1, 0.92] : isHovered ? [0.52, 0.74, 0.58] : [0.34, 0.5, 0.38],
                      scale: active ? [1, 1.08, 1] : [1, 1.03, 1]
                    }
              }
              className="absolute top-1/2"
              style={{
                left: `${x}%`,
                transform: "translate(-50%, -50%)",
                transformOrigin: "center"
              }}
              transition={{
                duration: prefersReducedMotion ? 0.16 : active ? 1.35 : 2.1,
                ease: "easeInOut",
                repeat: prefersReducedMotion ? 0 : Number.POSITIVE_INFINITY,
                delay: prefersReducedMotion ? 0 : index * 0.08
              }}
            >
              <span
                className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  backgroundColor: active ? accent : accentSoft,
                  opacity: active ? 0.24 : isHovered ? 0.1 : 0.05
                }}
              />
              <span
                className="absolute left-1/2 top-1/2 h-[0.34rem] w-[0.34rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ backgroundColor: "var(--theme-node)" }}
              />
              <span
                className="absolute left-1/2 top-1/2 h-[0.34rem] w-[0.34rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  backgroundColor: active ? accent : accentSoft,
                  opacity: active ? 0.92 : 0.68,
                  filter: `drop-shadow(0 0 8px ${active ? "var(--theme-node-active-glow)" : "var(--theme-node-glow)"})`
                }}
              />
            </motion.div>
          );
        })}
      </div>
    </motion.button>
  );
}
