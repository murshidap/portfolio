import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StarPoint = {
  id: string;
  x: number;
  y: number;
};

type ConstellationConnection = [string, string];

type Constellation = {
  id: string;
  name: string;
  description: string;
  stars: StarPoint[];
  connections: ConstellationConnection[];
};

const WIDGET_TITLE = "One thing I'm also enthusiastic about is stars!";
const WIDGET_SUBTITLE = "How about we explore some star constellations?";

const CONSTELLATIONS: Constellation[] = [
  {
    id: "orion",
    name: "Orion",
    description: "Famous for its central belt of three bright stars!",
    stars: [
      { id: "A", x: 28, y: 14 },
      { id: "B", x: 18, y: 36 },
      { id: "C", x: 48, y: 26 },
      { id: "D", x: 58, y: 50 },
      { id: "E", x: 52, y: 60 },
      { id: "F", x: 52, y: 88 },
      { id: "G", x: 86, y: 68 },
      { id: "H", x: 64, y: 46 }
    ],
    connections: [
      ["A", "B"],
      ["A", "C"],
      ["B", "E"],
      ["C", "H"],
      ["H", "D"],
      ["D", "E"],
      ["E", "F"],
      ["E", "G"],
      ["F", "G"]
    ]
  },
  {
    id: "taurus",
    name: "Taurus",
    description: "Its V-shaped face and long horns make it easy to recognize.",
    stars: [
      { id: "A", x: 16, y: 38 },
      { id: "B", x: 28, y: 48 },
      { id: "C", x: 44, y: 48 },
      { id: "D", x: 56, y: 34 },
      { id: "E", x: 70, y: 18 },
      { id: "F", x: 82, y: 12 },
      { id: "G", x: 72, y: 30 },
      { id: "H", x: 58, y: 60 },
      { id: "I", x: 52, y: 74 }
    ],
    connections: [
      ["A", "B"],
      ["B", "C"],
      ["C", "D"],
      ["D", "E"],
      ["E", "F"],
      ["E", "G"],
      ["D", "H"],
      ["H", "I"]
    ]
  },
  {
    id: "ursa-major",
    name: "Ursa Major",
    description: "Its Big Dipper asterism is one of the easiest shapes to spot.",
    stars: [
      { id: "A", x: 18, y: 40 },
      { id: "B", x: 30, y: 26 },
      { id: "C", x: 42, y: 44 },
      { id: "D", x: 28, y: 58 },
      { id: "E", x: 56, y: 40 },
      { id: "F", x: 70, y: 36 },
      { id: "G", x: 84, y: 30 }
    ],
    connections: [
      ["A", "B"],
      ["B", "C"],
      ["C", "D"],
      ["D", "A"],
      ["C", "E"],
      ["E", "F"],
      ["F", "G"]
    ]
  },
  {
    id: "cassiopeia",
    name: "Cassiopeia",
    description: "Recognizable for its graceful W-shaped zigzag across the sky.",
    stars: [
      { id: "A", x: 14, y: 18 },
      { id: "B", x: 30, y: 38 },
      { id: "C", x: 48, y: 36 },
      { id: "D", x: 66, y: 60 },
      { id: "E", x: 84, y: 34 }
    ],
    connections: [
      ["A", "B"],
      ["B", "C"],
      ["C", "D"],
      ["D", "E"]
    ]
  },
  {
    id: "leo",
    name: "Leo",
    description: "This lion-like outline is anchored by the sickle near its head.",
    stars: [
      { id: "A", x: 12, y: 72 },
      { id: "B", x: 32, y: 44 },
      { id: "C", x: 36, y: 72 },
      { id: "D", x: 66, y: 40 },
      { id: "E", x: 72, y: 22 },
      { id: "F", x: 90, y: 10 },
      { id: "G", x: 96, y: 18 },
      { id: "H", x: 80, y: 54 },
      { id: "I", x: 80, y: 72 }
    ],
    connections: [
      ["A", "B"],
      ["A", "C"],
      ["B", "C"],
      ["B", "D"],
      ["C", "I"],
      ["D", "E"],
      ["E", "F"],
      ["F", "G"],
      ["D", "H"],
      ["H", "I"]
    ]
  },
  {
    id: "scorpius",
    name: "Scorpius",
    description: "Its long curving tail gives this constellation a dramatic silhouette.",
    stars: [
      { id: "A", x: 12, y: 70 },
      { id: "B", x: 20, y: 58 },
      { id: "C", x: 28, y: 70 },
      { id: "D", x: 44, y: 70 },
      { id: "E", x: 58, y: 66 },
      { id: "F", x: 60, y: 44 },
      { id: "G", x: 68, y: 22 },
      { id: "H", x: 76, y: 16 },
      { id: "I", x: 86, y: 10 },
      { id: "J", x: 88, y: 20 },
      { id: "K", x: 98, y: 14 }
    ],
    connections: [
      ["A", "B"],
      ["B", "C"],
      ["C", "D"],
      ["D", "E"],
      ["E", "F"],
      ["F", "G"],
      ["G", "H"],
      ["H", "I"],
      ["H", "J"],
      ["H", "K"]
    ]
  },
  {
    id: "andromeda",
    name: "Andromeda",
    description: "A long chained line of stars that drifts elegantly across the sky.",
    stars: [
      { id: "A", x: 30, y: 12 },
      { id: "B", x: 18, y: 30 },
      { id: "C", x: 44, y: 40 },
      { id: "D", x: 48, y: 52 },
      { id: "E", x: 44, y: 64 },
      { id: "F", x: 56, y: 58 },
      { id: "G", x: 60, y: 48 },
      { id: "H", x: 64, y: 40 },
      { id: "I", x: 72, y: 60 },
      { id: "J", x: 90, y: 84 }
    ],
    connections: [
      ["A", "C"],
      ["B", "E"],
      ["C", "D"],
      ["D", "E"],
      ["D", "F"],
      ["F", "G"],
      ["G", "H"],
      ["F", "I"],
      ["I", "J"]
    ]
  }
];

function normalizeConnection(a: string, b: string) {
  return [a, b].sort().join("__");
}

function findStar(stars: StarPoint[], id: string) {
  return stars.find((star) => star.id === id);
}

function starDelay(id: string) {
  return (id.charCodeAt(0) % 7) * 0.35;
}

export function ConstellationWidget() {
  const prefersReducedMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedStar, setSelectedStar] = useState<string | null>(null);
  const [userConnections, setUserConnections] = useState<string[]>([]);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const constellation = CONSTELLATIONS[currentIndex];
  const correctConnections = useMemo(
    () => constellation.connections.map(([from, to]) => normalizeConnection(from, to)),
    [constellation]
  );

  const isComplete = useMemo(() => {
    if (userConnections.length !== correctConnections.length) {
      return false;
    }

    return userConnections.every((connection) => correctConnections.includes(connection));
  }, [correctConnections, userConnections]);

  useEffect(() => {
    if (!isComplete) {
      setIsFadingOut(false);
      return;
    }

    const fadeDelay = prefersReducedMotion ? 900 : 1400;
    const advanceDelay = prefersReducedMotion ? 1250 : 2150;

    const fadeTimer = window.setTimeout(() => {
      setIsFadingOut(true);
    }, fadeDelay);

    const nextTimer = window.setTimeout(() => {
      setCurrentIndex((previous) => (previous + 1) % CONSTELLATIONS.length);
      setSelectedStar(null);
      setUserConnections([]);
      setIsFadingOut(false);
    }, advanceDelay);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(nextTimer);
    };
  }, [isComplete, prefersReducedMotion]);

  const handleStarSelect = (starId: string) => {
    if (isComplete || isFadingOut) {
      return;
    }

    if (selectedStar === null) {
      setSelectedStar(starId);
      return;
    }

    if (selectedStar === starId) {
      setSelectedStar(null);
      return;
    }

    const connectionKey = normalizeConnection(selectedStar, starId);

    setUserConnections((previous) =>
      previous.includes(connectionKey)
        ? previous.filter((connection) => connection !== connectionKey)
        : [...previous, connectionKey]
    );
    setSelectedStar(starId);
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[360px]"
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <Card className="relative overflow-hidden border-white/12 bg-[linear-gradient(180deg,rgba(10,14,34,0.84),rgba(7,9,22,0.72))] p-4 shadow-[0_24px_80px_rgba(4,8,24,0.45)] md:p-5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(116,104,255,0.15),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(78,119,255,0.14),transparent_38%)]" />

        <div className="relative z-10">
          <div className="mb-4 space-y-1">
            <p className="font-open-sans-light text-[0.68rem] uppercase tracking-[0.22em] text-[#98a0c4]/72">
              starfield note
            </p>
            <h3 className="max-w-[20rem] font-display text-[0.98rem] leading-6 text-white/86 md:text-[1.05rem]">
              {WIDGET_TITLE}
            </h3>
            <p className="font-open-sans-light text-[0.82rem] leading-5 text-[#aeb7cf]/58">{WIDGET_SUBTITLE}</p>
          </div>

          <motion.div
            animate={
              isComplete && !prefersReducedMotion
                ? {
                    boxShadow: [
                      "0 0 0 rgba(118,116,255,0)",
                      "0 0 34px rgba(118,116,255,0.18)",
                      "0 0 0 rgba(118,116,255,0)"
                    ]
                  }
                : { boxShadow: "0 0 0 rgba(118,116,255,0)" }
            }
            className={cn(
              "relative rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0.01))] px-3 py-3",
              isComplete ? "border-[#8688ff]/30" : "border-white/8"
            )}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={constellation.id}
                animate={{ opacity: isFadingOut ? 0 : 1, scale: isFadingOut ? 0.985 : 1 }}
                className="relative h-[230px] w-full"
                initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.985 }}
                transition={{ duration: prefersReducedMotion ? 0.2 : 0.45, ease: "easeOut" }}
              >
                <svg
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full overflow-visible"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 100"
                >
                  {userConnections.map((connection) => {
                    const [fromId, toId] = connection.split("__");
                    const fromStar = findStar(constellation.stars, fromId);
                    const toStar = findStar(constellation.stars, toId);

                    if (!fromStar || !toStar) {
                      return null;
                    }

                    const isCorrect = correctConnections.includes(connection);

                    return (
                      <motion.line
                        key={connection}
                        animate={
                          isComplete && !prefersReducedMotion
                            ? { opacity: [0.8, 1, 0.84] }
                            : { opacity: isCorrect ? 0.9 : 0.62 }
                        }
                        initial={{ opacity: 0 }}
                        stroke={isCorrect ? "rgba(158, 182, 255, 0.96)" : "rgba(132, 118, 232, 0.68)"}
                        strokeLinecap="round"
                        strokeWidth="1.35"
                        style={{
                          filter: isCorrect
                            ? "drop-shadow(0 0 10px rgba(111,149,255,0.95))"
                            : "drop-shadow(0 0 7px rgba(132,118,232,0.58))"
                        }}
                        transition={{ duration: prefersReducedMotion ? 0.12 : 0.22, ease: "easeOut" }}
                        vectorEffect="non-scaling-stroke"
                        x1={fromStar.x}
                        x2={toStar.x}
                        y1={fromStar.y}
                        y2={toStar.y}
                      />
                    );
                  })}
                </svg>

                {constellation.stars.map((star) => {
                  const isSelected = selectedStar === star.id;

                  return (
                    <motion.button
                      key={star.id}
                      animate={
                        prefersReducedMotion
                          ? { opacity: 1, scale: isSelected ? 1.08 : 1 }
                          : {
                              opacity: isComplete ? [0.9, 1, 0.92] : [0.82, 1, 0.84],
                              scale: isSelected ? 1.18 : [1, 1.08, 1]
                            }
                      }
                      aria-label={`Select star ${star.id} in ${constellation.name}`}
                      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b8dff]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090d1f]"
                      onClick={() => handleStarSelect(star.id)}
                      style={{ left: `${star.x}%`, top: `${star.y}%` }}
                      transition={{
                        duration: prefersReducedMotion ? 0.16 : 2.2,
                        ease: "easeInOut",
                        repeat: prefersReducedMotion ? 0 : Number.POSITIVE_INFINITY,
                        delay: prefersReducedMotion ? 0 : starDelay(star.id)
                      }}
                      type="button"
                    >
                      <span
                        className={cn(
                          "absolute inset-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full",
                          isSelected ? "bg-[#9ca7ff]/16" : "bg-transparent"
                        )}
                      />
                      <span
                        className={cn(
                          "absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border",
                          isSelected ? "h-4 w-4 border-[#bcc6ff]/75" : "h-0 w-0 border-transparent"
                        )}
                      />
                      <span
                        className={cn(
                          "relative block rounded-full",
                          isSelected
                            ? "h-[0.56rem] w-[0.56rem] bg-[#eef3ff] shadow-[0_0_16px_rgba(161,184,255,1)]"
                            : "h-[0.42rem] w-[0.42rem] bg-[#eef2ff] shadow-[0_0_12px_rgba(126,162,255,0.9)]"
                        )}
                      />
                    </motion.button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <div className="mt-4 min-h-[2.75rem]">
            <AnimatePresence mode="wait">
              {isComplete ? (
                <motion.div
                  key={constellation.id + "-complete"}
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 8 }}
                  transition={{ duration: prefersReducedMotion ? 0.18 : 0.35, ease: "easeOut" }}
                >
                  <p className="font-display text-[0.84rem] tracking-[0.1em] text-[#b7c1ff]">{constellation.name}</p>
                  <p className="mt-1 font-open-sans-light text-[0.8rem] leading-5 text-[#c8d0e3]/68">
                    {constellation.description}
                  </p>
                </motion.div>
              ) : (
                <motion.p
                  key={constellation.id + "-hint"}
                  animate={{ opacity: 1 }}
                  className="font-open-sans-light text-[0.76rem] leading-5 text-[#aeb7cf]/42"
                  initial={{ opacity: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0.12 : 0.28 }}
                >
                  Connect the stars to reveal {constellation.name}.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
