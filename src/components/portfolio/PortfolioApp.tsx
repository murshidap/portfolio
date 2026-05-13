import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Mail, Share2 } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import type { PortfolioContent } from "@/types/content";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ViewKey = "home" | "skills" | "projects" | "experience" | "certificates" | "education";

interface PortfolioAppProps {
  initialContent: PortfolioContent;
}

const views: Array<{ key: ViewKey; label: string }> = [
  { key: "home", label: "Home" },
  { key: "skills", label: "Skills" },
  { key: "projects", label: "Projects" },
  { key: "experience", label: "Experience" },
  { key: "certificates", label: "Certificates" },
  { key: "education", label: "Education" }
];

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

function FullSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mx-auto flex min-h-[72vh] w-full max-w-[1120px] flex-col justify-center py-10">
      <div className="mb-6 h-px w-16 bg-[linear-gradient(90deg,#6671ff,transparent)]" />
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
                <p className="text-xs uppercase tracking-[0.24em] text-[#7d85ff]">{project.subtitle}</p>
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
      return (
        <FullSection title="Skills">
          <div className="flex flex-wrap gap-4">
            {content.intro.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm uppercase tracking-[0.18em] text-white/72 backdrop-blur-xl"
              >
                {skill}
              </span>
            ))}
          </div>
        </FullSection>
      );
    case "experience":
      return (
        <FullSection title="Experience">
          <div className="space-y-4">
            {content.experience.map((item) => (
              <Card key={item.id} className="p-6">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h3 className="font-display text-2xl text-white">{item.role}</h3>
                    <p className="mt-1 text-sm uppercase tracking-[0.22em] text-[#7d85ff]">{item.company}</p>
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
                <p className="mt-2 text-sm uppercase tracking-[0.22em] text-[#7d85ff]">{item.issuer}</p>
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
                    <p className="mt-1 text-sm uppercase tracking-[0.22em] text-[#7d85ff]">{item.institution}</p>
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

export function PortfolioApp({ initialContent }: PortfolioAppProps) {
  const [activeView, setActiveView] = useState<ViewKey>("home");
  const content = useMemo(() => initialContent, [initialContent]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050818] text-white">
      <div className="absolute inset-0 bg-hero-grid" />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 65% 36%, rgba(78, 119, 255, 0.58), transparent 16%), radial-gradient(circle at 82% 82%, rgba(123, 78, 255, 0.28), transparent 14%)"
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_28%)] opacity-40" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="font-faded-display pointer-events-none absolute left-1/2 top-[12%] z-0 flex w-max -translate-x-1/2 flex-col items-center text-center text-[clamp(6rem,22vw,20rem)] font-black leading-[0.82] tracking-[0.02em] text-white/[0.025]">
          <span className="block text-center">WEB</span>
          <span className="block text-center">DEVELOPER</span>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1600px] flex-col px-5 pb-8 pt-6 md:px-8 lg:px-10 xl:px-16">
        <header className="relative z-30 grid grid-cols-[1fr_auto] items-center gap-4 text-[11px] uppercase tracking-[0.42em] text-white/88 md:grid-cols-[1fr_auto_1fr] md:text-sm">
          <div className="hidden md:block" />

          <div className="mx-auto flex flex-wrap items-center justify-center gap-6 rounded-full border border-white/10 bg-white/[0.05] px-7 py-3 shadow-panel backdrop-blur-2xl md:gap-10 md:px-10">
            {views.map((view) => {
              const active = activeView === view.key;
              return (
                <button
                  key={view.key}
                  className={cn(
                    "text-[11px] tracking-[0.34em] transition md:text-sm",
                    active ? "text-[#8d73ff]" : "text-white/62 hover:text-white"
                  )}
                  onClick={() => setActiveView(view.key)}
                  type="button"
                >
                  {view.label}
                </button>
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
                      <span className="block">DEVELOPER</span>
                    </div>
                    <div className="absolute bottom-[8%] left-[10%] right-[10%] top-[6%] rounded-full bg-[radial-gradient(circle,rgba(77,116,255,0.82),rgba(77,116,255,0.18)_45%,transparent_70%)] blur-[60px]" />
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
                  <p className="font-rostex-regular text-[1.2rem] uppercase tracking-[0.2em] text-white/78 md:text-[1.42rem] lg:text-[1.68rem]">
                    {content.intro.name.replace(/\./g, "")}
                  </p>
                  <p className="font-open-sans-light mt-3 max-w-[280px] text-[0.82rem] font-light leading-6 tracking-[0.04em] text-[#9ca5bb]/32 md:max-w-[320px] md:text-[0.88rem] lg:max-w-[340px]">
                    {content.intro.intro}
                  </p>
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
