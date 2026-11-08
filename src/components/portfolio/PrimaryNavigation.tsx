import { Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import ContactActions from "@/components/portfolio/ContactActions";
import type { IntroContent } from "@/types/content";

type PortfolioView = "home" | "about" | "projects" | "experience" | "certificates" | "gallery";

const views: Array<{ key: PortfolioView; label: string; href: string }> = [
  { key: "home", label: "Home", href: "/#home" },
  { key: "about", label: "About Me", href: "/#about" },
  { key: "experience", label: "Experience", href: "/#experience" },
  { key: "projects", label: "Projects", href: "/#projects" },
  { key: "gallery", label: "Gallery", href: "/#gallery" },
  { key: "certificates", label: "Certificates", href: "/#certificates" }
];

const navigationViews = views.filter((view) => view.key !== "about");

export default function PrimaryNavigation({
  activeView,
  intro
}: {
  activeView: PortfolioView;
  intro: IntroContent;
}) {
  const [open, setOpen] = useState(false);
  const [currentView, setCurrentView] = useState(activeView);
  const scrollAnimationRef = useRef(0);
  const originalScrollBehaviorRef = useRef<string | null>(null);
  const activeViewLabel = views.find((view) => view.key === currentView)?.label;

  useEffect(() => {
    const sections = views.flatMap((view) => {
      const section = document.getElementById(view.key);
      return section ? [{ key: view.key, section }] : [];
    });

    if (sections.length === 0) {
      return;
    }

    let animationFrame = 0;
    const updateCurrentView = () => {
      animationFrame = 0;
      const activationPoint = window.innerHeight * 0.3;
      const activeSection = sections.reduce((active, candidate) =>
        candidate.section.getBoundingClientRect().top <= activationPoint ? candidate : active
      , sections[0]);

      setCurrentView(activeSection.key);
    };
    const scheduleUpdate = () => {
      if (animationFrame === 0) {
        animationFrame = window.requestAnimationFrame(updateCurrentView);
      }
    };

    updateCurrentView();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-primary-header]");
    if (!header) {
      return;
    }

    let animationFrame = 0;
    let toneResetTimeout = 0;
    let previousTone = header.getAttribute("data-section-tone") ?? "light";
    const updateSectionTone = () => {
      animationFrame = 0;
      const toneCheckY = Math.min(window.innerHeight - 1, Math.ceil(header.getBoundingClientRect().bottom));
      const sectionBelowHeader = document
        .elementFromPoint(window.innerWidth / 2, toneCheckY)
        ?.closest<HTMLElement>("#experience, #gallery");
      const nextTone = sectionBelowHeader ? "dark" : "light";

      if (nextTone === previousTone) {
        return;
      }

      window.clearTimeout(toneResetTimeout);
      header.removeAttribute("data-tone-transition");
      header.setAttribute("data-section-tone", nextTone);

      if (nextTone === "light") {
        header.setAttribute("data-tone-transition", "light");
        toneResetTimeout = window.setTimeout(() => {
          header.setAttribute("data-tone-transition", "reset");
        }, 240);
      }

      previousTone = nextTone;
    };
    const scheduleUpdate = () => {
      if (animationFrame === 0) {
        animationFrame = window.requestAnimationFrame(updateSectionTone);
      }
    };

    updateSectionTone();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.clearTimeout(toneResetTimeout);
      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  useEffect(() => () => {
    window.cancelAnimationFrame(scrollAnimationRef.current);
    if (originalScrollBehaviorRef.current !== null) {
      document.documentElement.style.scrollBehavior = originalScrollBehaviorRef.current;
    }
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const navigateToView = (event: React.MouseEvent<HTMLAnchorElement>, view: (typeof views)[number]) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      window.location.pathname !== "/"
    ) {
      return;
    }

    const section = document.getElementById(view.key);
    if (!section) {
      return;
    }

    event.preventDefault();
    window.cancelAnimationFrame(scrollAnimationRef.current);
    if (originalScrollBehaviorRef.current === null) {
      originalScrollBehaviorRef.current = document.documentElement.style.scrollBehavior;
    }
    document.documentElement.style.scrollBehavior = "auto";
    history.pushState(null, "", view.href);
    setCurrentView(view.key);
    setOpen(false);

    const headerHeight = document.querySelector<HTMLElement>("[data-primary-header]")?.getBoundingClientRect().height ?? 0;
    const startY = window.scrollY;
    const previousPosition = section.style.position;
    if (getComputedStyle(section).position === "sticky") {
      section.style.position = "relative";
    }
    const sectionDocumentTop = section.getBoundingClientRect().top + startY;
    section.style.position = previousPosition;
    const targetY = Math.max(0, sectionDocumentTop - headerHeight);
    const distance = targetY - startY;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = prefersReducedMotion ? 0 : Math.min(900, Math.max(400, Math.abs(distance) * 0.35));
    const startTime = performance.now();

    const animateScroll = (time: number) => {
      const progress = duration === 0 ? 1 : Math.min(1, (time - startTime) / duration);
      const easedProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      window.scrollTo(0, startY + distance * easedProgress);

      if (progress < 1) {
        scrollAnimationRef.current = window.requestAnimationFrame(animateScroll);
        return;
      }

      scrollAnimationRef.current = 0;
      if (originalScrollBehaviorRef.current !== null) {
        document.documentElement.style.scrollBehavior = originalScrollBehaviorRef.current;
        originalScrollBehaviorRef.current = null;
      }
    };

    scrollAnimationRef.current = window.requestAnimationFrame(animateScroll);
  };

  return (
    <>
      {open ? (
        <button
          aria-label="Dismiss navigation overlay"
          className="fixed inset-0 z-40 bg-black/25 md:hidden"
          onClick={() => setOpen(false)}
          type="button"
        />
      ) : null}

      <div className="relative z-30 flex w-full items-center justify-between md:contents">
        <span className="font-open-sans-light text-base font-medium text-zinc-800 md:hidden">{activeViewLabel}</span>
        <button
          aria-controls="primary-navigation-panel"
          aria-expanded={open}
          aria-label={open ? "Close navigation" : "Open navigation"}
          className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-800 hover:bg-zinc-950/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-800 md:hidden"
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          <Menu aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      <div
        className={
          open
            ? "fixed inset-y-0 right-0 z-50 flex w-[min(22rem,100vw)] flex-col items-stretch gap-8 overflow-y-auto bg-white px-6 pb-8 pt-24 shadow-2xl md:contents"
            : "hidden md:contents"
        }
        id="primary-navigation-panel"
      >
        <nav
          aria-label="Primary navigation"
          className="flex flex-col items-start gap-2 md:flex-row md:flex-wrap md:items-center md:justify-start md:gap-10"
        >
          {navigationViews.map((view) => (
            <a
              key={view.key}
              aria-current={currentView === view.key ? "location" : undefined}
              className={[
                "font-open-sans-light block w-full rounded-md px-3 py-3 text-base font-medium normal-case tracking-normal md:relative md:w-auto md:rounded-none md:px-0 md:py-0 md:pb-1 md:text-base md:transition md:after:absolute md:after:bottom-0 md:after:left-0 md:after:h-px md:after:bg-current md:after:transition-[width] md:after:duration-300",
                currentView === view.key
                  ? "theme-nav-active bg-zinc-950/5 md:bg-transparent md:after:w-full"
                  : "text-zinc-800 hover:bg-zinc-950/5 hover:text-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-800 md:bg-transparent md:after:w-0 md:hover:bg-transparent md:hover:after:w-full md:focus-visible:after:w-full"
              ].join(" ")}
              href={view.href}
              onClick={(event) => {
                navigateToView(event, view);
                setCurrentView(view.key);
                setOpen(false);
              }}
            >
              {view.label}
            </a>
          ))}
        </nav>

        <ContactActions intro={intro} />
      </div>
    </>
  );
}
