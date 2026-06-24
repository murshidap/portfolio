import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Mail, Share2 } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

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
          className="text-white/65 transition hover:text-white"
          href={item.href}
          rel="noreferrer"
          target={item.href.startsWith("http") ? "_blank" : undefined}
        >
          {item.icon}
        </a>
      ))}
      <button
        aria-label="Copy website address"
        className="text-white/65 transition hover:text-white"
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

const skillSlots = [
  { offset: -2, left: "-4%", top: "72%", scale: 0.52, opacity: 0.26, blur: 6, zIndex: 0 },
  { offset: -1, left: "24%", top: "48%", scale: 0.72, opacity: 0.58, blur: 3, zIndex: 1 },
  { offset: 0, left: "50%", top: "30%", scale: 1, opacity: 1, blur: 0, zIndex: 3 },
  { offset: 1, left: "76%", top: "48%", scale: 0.72, opacity: 0.58, blur: 3, zIndex: 1 },
  { offset: 2, left: "104%", top: "72%", scale: 0.52, opacity: 0.26, blur: 6, zIndex: 0 }
];

const skillFlowTransition = {
  duration: 0.92,
  ease: [0.16, 1, 0.3, 1] as const
};

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
        <path d="M51 43h31L45 93l4-37H18L55 7l-4 36Z" fill="rgba(255,255,255,0.26)" />
      </svg>
    );
  }

  return <span className="font-display text-[clamp(2rem,5vw,4rem)] font-bold">{getSkillInitials(skill)}</span>;
}

function SkillTile({ active, skill }: { active: boolean; skill: string }) {
  return (
    <div
      className={cn(
        "group relative grid aspect-square w-[clamp(5.4rem,15vw,9rem)] place-items-center overflow-hidden rounded-[1.4rem] border backdrop-blur-2xl",
        active ? "border-white/24 bg-white/[0.13] shadow-[0_26px_90px_rgba(0,0,0,0.42)]" : "border-white/10 bg-white/[0.055]"
      )}
    >
      <div className="absolute inset-[10%] rounded-full border border-white/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_28%,rgba(255,255,255,0.22),transparent_34%),linear-gradient(135deg,color-mix(in_srgb,var(--theme-accent)_72%,transparent),color-mix(in_srgb,var(--theme-accent-soft)_48%,transparent))]" />
      <div className="relative z-10 grid h-full w-full place-items-center text-white drop-shadow-[0_12px_28px_rgba(0,0,0,0.34)]">
        <SkillMark skill={skill} />
      </div>
    </div>
  );
}

function SkillsShowcase({ skills }: { skills: string[] }) {
  const skillItems = useMemo(() => skills.map((skill) => skill.trim()).filter(Boolean), [skills]);
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);
  const activeSkill = skillItems.length > 0 ? skillItems[((activeSkillIndex % skillItems.length) + skillItems.length) % skillItems.length] : "";

  useEffect(() => {
    if (skillItems.length === 0) {
      return;
    }

    setActiveSkillIndex(0);
  }, [skillItems.length]);

  useEffect(() => {
    if (skillItems.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveSkillIndex((currentIndex) => currentIndex + 1);
    }, 2600);

    return () => window.clearInterval(intervalId);
  }, [skillItems.length]);

  if (skillItems.length === 0) {
    return null;
  }

  const visibleSkillPlacements = skillSlots
    .filter((slot) => skillItems.length > 1 || slot.offset === 0)
    .map((slot) => {
      const virtualIndex = activeSkillIndex + slot.offset;
      const skillIndex = ((virtualIndex % skillItems.length) + skillItems.length) % skillItems.length;
      const skill = skillItems[skillIndex];

      return { skill, slot, virtualIndex };
    });

  return (
    <section className="mx-auto flex min-h-[72vh] w-full max-w-[1120px] flex-col justify-center overflow-hidden py-8">
      <div className="theme-active-bar mb-7 h-px w-16" />
      <div className="relative min-h-[430px] overflow-hidden sm:min-h-[500px]">
        <AnimatePresence initial={false}>
          {visibleSkillPlacements.map(({ skill, slot, virtualIndex }) => {
            const active = slot.offset === 0;

            return (
              <motion.button
                key={`${skill}-${virtualIndex}`}
                animate={{
                  filter: `blur(${slot.blur}px)`,
                  left: slot.left,
                  opacity: slot.opacity,
                  scale: slot.scale,
                  top: slot.top,
                  x: "-50%",
                  y: "-50%"
                }}
                aria-label={`Focus ${skill}`}
                className="absolute"
                exit={{
                  filter: "blur(8px)",
                  opacity: 0,
                  scale: 0.42,
                  x: "-50%",
                  y: "-50%"
                }}
                initial={{
                  filter: "blur(8px)",
                  opacity: 0,
                  scale: 0.42,
                  x: "-50%",
                  y: "-50%"
                }}
                onClick={() => setActiveSkillIndex(virtualIndex)}
                style={{ zIndex: slot.zIndex }}
                transition={skillFlowTransition}
                type="button"
              >
                <SkillTile active={active} skill={skill} />
              </motion.button>
            );
          })}
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-[4] flex flex-col items-center text-center sm:bottom-8">
          <AnimatePresence mode="wait">
            <motion.h2
              key={activeSkill}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              aria-live="polite"
              className="font-rostex-regular text-[clamp(2.7rem,8vw,5.8rem)] uppercase leading-[0.95] text-white"
              exit={{ opacity: 0, y: 22, filter: "blur(8px)" }}
              initial={{ opacity: 0, y: -18, filter: "blur(8px)" }}
              transition={{ duration: 0.48, ease: "easeOut" }}
            >
              {activeSkill}
            </motion.h2>
          </AnimatePresence>
          <div className="theme-active-bar mt-6 h-px w-[min(22rem,70vw)]" />
        </div>
      </div>
    </section>
  );
}

function FullSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mx-auto flex min-h-[72vh] w-full max-w-[1120px] flex-col justify-center py-10">
      <div className="theme-active-bar mb-6 h-px w-16" />
      <h2 className="font-display text-[clamp(2.8rem,8vw,5.5rem)] uppercase tracking-[0.16em] text-white">{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function renderFullView(view: ViewKey, content: PortfolioContent) {
  switch (view) {
    case "projects":
      return (
        <FullSection title="Projects">
          <div className="grid gap-4 md:grid-cols-2">
            {content.projects.map((project) => (
              <Card key={project.id} className="p-6">
                <p className="theme-accent-text text-xs uppercase tracking-[0.24em]">{project.subtitle}</p>
                <h3 className="mt-3 font-display text-2xl text-white">{project.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/72">{project.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span key={item} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
                      {item}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </FullSection>
      );
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
                    <h3 className="font-display text-2xl text-white">{item.role}</h3>
                    <p className="theme-accent-text mt-1 text-sm uppercase tracking-[0.22em]">{item.company}</p>
                  </div>
                  <p className="text-sm text-white/55">{item.duration}</p>
                </div>
                <p className="mt-4 text-sm leading-7 text-white/72">{item.description}</p>
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
                <h3 className="font-display text-2xl text-white">{item.title}</h3>
                <p className="theme-accent-text mt-2 text-sm uppercase tracking-[0.22em]">{item.issuer}</p>
                <p className="mt-4 text-sm text-white/65">{item.year}</p>
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
                    <h3 className="font-display text-2xl text-white">{item.degree}</h3>
                    <p className="theme-accent-text mt-1 text-sm uppercase tracking-[0.22em]">{item.institution}</p>
                  </div>
                  <p className="text-sm text-white/55">{item.duration}</p>
                </div>
                <p className="mt-4 text-sm leading-7 text-white/72">{item.description}</p>
              </Card>
            ))}
          </div>
        </FullSection>
      );
    default:
      return null;
  }
}

const flickerTransition = {
  duration: 0.95,
  ease: "easeOut" as const,
  times: [0, 0.12, 0.22, 0.36, 0.52, 0.7, 1]
};

export function PortfolioApp({ initialContent, initialView = "home" }: PortfolioAppProps) {
  const [themeIndex, setThemeIndex] = useState(DEFAULT_THEME_INDEX);
  const activeView = initialView;
  const content = useMemo(() => initialContent, [initialContent]);
  const activeTheme = PORTFOLIO_THEMES[themeIndex];
  const themeStyle = useMemo(() => getThemeStyle(activeTheme), [activeTheme]);

  const handleAdvanceTheme = () => {
    setThemeIndex((currentThemeIndex) => (currentThemeIndex + 1) % PORTFOLIO_THEMES.length);
  };

  return (
    <main className="theme-shell relative min-h-screen overflow-hidden text-white" style={themeStyle}>
      <div className="theme-hero-grid absolute inset-0" />
      <div className="theme-hero-spotlight absolute inset-0 opacity-60" />
      <div className="theme-top-glow absolute inset-0 opacity-40" />
      {activeView === "home" ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="font-faded-display pointer-events-none absolute left-1/2 top-[12%] z-0 flex w-max -translate-x-1/2 flex-col items-center text-center text-[clamp(6rem,22vw,20rem)] font-black leading-[0.82] tracking-[0.02em] text-white/[0.025]">
            <span className="block text-center">WEB</span>
            <span className="block text-center">DEVELOPER</span>
          </div>
        </div>
      ) : null}

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1600px] flex-col px-5 pb-8 pt-6 md:px-8 lg:px-10 xl:px-16">
        <header className="relative z-30 grid grid-cols-[1fr_auto] items-center gap-4 text-[11px] uppercase tracking-[0.42em] text-white/88 md:grid-cols-[1fr_auto_1fr] md:text-sm">
          <div className="hidden md:block" />

          <div className="theme-glass mx-auto flex flex-wrap items-center justify-center gap-6 rounded-full border px-7 py-3 backdrop-blur-2xl md:gap-10 md:px-10">
            {views.map((view) => {
              const active = activeView === view.key;
              return (
                <a
                  key={view.key}
                  className={cn(
                    "text-[11px] tracking-[0.34em] transition md:text-sm",
                    active ? "theme-nav-active" : "text-white/62 hover:text-white"
                  )}
                  href={getViewHref(view.key)}
                >
                  {view.label}
                </a>
              );
            })}
            <a download href={content.intro.resume_url || "#"}>
              <Button className="h-10 min-w-[160px] px-4 text-[11px] tracking-[0.16em]" disabled={!content.intro.resume_url}>
                <span>Get Resume</span>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </a>
          </div>

          <SocialLinks className="flex items-center justify-end gap-4 md:gap-5" content={content.intro} />
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
                    <div className="font-rostex-regular mb-[-1.5rem] translate-y-8 text-center text-[clamp(3.4rem,9vw,8.2rem)] font-black leading-[0.82] tracking-[0.04em] text-white lg:mb-[-2.5rem] lg:translate-y-14">
                      <span className="block text-[1.12em]">WEB</span>
                      <span className="relative inline-block">
                        <span className="inline-block">DEVELOPER</span>
                        <ConstellationWidget activeIndex={themeIndex} onAdvance={handleAdvanceTheme} themes={PORTFOLIO_THEMES} />
                      </span>
                    </div>
                    <div className="theme-portrait-orb absolute bottom-[8%] left-[10%] right-[10%] top-[6%] rounded-full blur-[60px]" />
                    <div className="relative z-10 -mt-20 w-full md:-mt-24 lg:-mt-32">
                      <motion.img
                        alt="Murshida portrait"
                        animate={{ opacity: 1, y: 0 }}
                        className="mx-auto w-full max-w-[620px] object-contain drop-shadow-[0_18px_60px_rgba(4,5,18,0.95)] md:max-w-[700px] lg:max-w-[800px]"
                        initial={{ opacity: 0, y: 28 }}
                        src={content.intro.profile_image_url}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <div className="order-3 relative z-20 lg:absolute lg:bottom-4 lg:left-16 xl:bottom-8 xl:left-24">
                <div className="mt-8 text-left">
                  <motion.p
                    animate={{
                      opacity: [0, 0.98, 0.36, 0.9, 0.52, 1, 1],
                      textShadow: [
                        "0 0 28px rgba(255,255,255,0.34)",
                        "0 0 16px rgba(255,255,255,0.18)",
                        "0 0 10px rgba(255,255,255,0.08)",
                        "0 0 12px rgba(255,255,255,0.14)",
                        "0 0 6px rgba(255,255,255,0.05)",
                        "0 0 0 rgba(255,255,255,0)",
                        "0 0 0 rgba(255,255,255,0)"
                      ]
                    }}
                    className="font-rostex-regular text-[1.2rem] uppercase tracking-[0.2em] text-white/78 md:text-[1.42rem] lg:text-[1.68rem]"
                    initial={{ opacity: 0, textShadow: "0 0 30px rgba(255,255,255,0.34)" }}
                    transition={{ ...flickerTransition, delay: 0.12 }}
                  >
                    {content.intro.name.replace(/\./g, "")}
                  </motion.p>
                  <motion.p
                    animate={{
                      opacity: [0, 0.84, 0.22, 0.76, 0.44, 1, 1],
                      textShadow: [
                        "0 0 18px rgba(186,196,220,0.24)",
                        "0 0 10px rgba(186,196,220,0.16)",
                        "0 0 4px rgba(186,196,220,0.08)",
                        "0 0 8px rgba(186,196,220,0.12)",
                        "0 0 3px rgba(186,196,220,0.06)",
                        "0 0 0 rgba(186,196,220,0)",
                        "0 0 0 rgba(186,196,220,0)"
                      ]
                    }}
                    className="theme-faint-copy font-open-sans-light mt-3 max-w-[280px] text-[0.82rem] font-light leading-6 tracking-[0.04em] md:max-w-[320px] md:text-[0.88rem] lg:max-w-[340px]"
                    initial={{ opacity: 0, textShadow: "0 0 20px rgba(186,196,220,0.22)" }}
                    transition={{ ...flickerTransition, delay: 0.24 }}
                  >
                    {content.intro.intro}
                  </motion.p>
                </div>

                <SocialLinks className="mt-10 flex flex-wrap gap-4 lg:hidden" content={content.intro} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={activeView}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-0 flex flex-1"
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
