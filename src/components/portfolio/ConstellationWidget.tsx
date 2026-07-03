import type { PortfolioTheme } from "@/components/portfolio/themeSystem";

type ThemeRailProps = {
  activeIndex: number;
  themes: PortfolioTheme[];
};

export function ConstellationWidget({ activeIndex, themes }: ThemeRailProps) {
  const activeTheme = themes[activeIndex];
  const accent = activeTheme.colors[3];
  const accentSoft = activeTheme.colors[4];
  const startX = 2;
  const endX = 98;
  const span = endX - startX;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-[calc(100%+0.55rem)] z-20 h-9 w-full md:top-[calc(100%+0.7rem)]"
      style={{ opacity: 0.56 }}
    >
      <div aria-hidden="true" className="relative h-full w-full">
        <div
          className="absolute top-1/2 h-px -translate-y-1/2 rounded-full"
          style={{
            left: `${startX}%`,
            right: `${100 - endX}%`,
            backgroundColor: accentSoft,
            opacity: 0.42
          }}
        />

        {themes.map((theme, index) => {
          const x = startX + (span * index) / (themes.length - 1);
          const active = index === activeIndex;

          return (
            <div
              key={theme.id}
              className="absolute top-1/2"
              style={{
                left: `${x}%`,
                opacity: active ? 1 : 0.5,
                transform: "translate(-50%, -50%)",
                transformOrigin: "center"
              }}
            >
              <span
                className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  backgroundColor: active ? accent : accentSoft,
                  opacity: active ? 0.24 : 0.05
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
                  opacity: active ? 0.92 : 0.68
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
