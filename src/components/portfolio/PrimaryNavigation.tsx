import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

import ContactActions from "@/components/portfolio/ContactActions";
import type { IntroContent } from "@/types/content";

type PortfolioView = "home" | "about" | "skills" | "projects" | "experience" | "certificates";

const views: Array<{ key: PortfolioView; label: string; href: string }> = [
  { key: "home", label: "Home", href: "/" },
  { key: "about", label: "About Me", href: "/about" },
  { key: "skills", label: "Skills", href: "/skills" },
  { key: "projects", label: "Projects", href: "/projects" },
  { key: "experience", label: "Experience", href: "/experience" },
  { key: "certificates", label: "Certificates", href: "/certifications" }
];

export default function PrimaryNavigation({
  activeView,
  intro
}: {
  activeView: PortfolioView;
  intro: IntroContent;
}) {
  const [open, setOpen] = useState(false);
  const activeViewLabel = views.find((view) => view.key === activeView)?.label;

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
          {views.map((view) => (
            <a
              key={view.key}
              aria-current={activeView === view.key ? "page" : undefined}
              className={[
                "font-open-sans-light block w-full rounded-md px-3 py-3 text-base font-medium normal-case tracking-normal md:relative md:w-auto md:rounded-none md:px-0 md:py-0 md:pb-1 md:text-base md:transition md:after:absolute md:after:bottom-0 md:after:left-0 md:after:h-px md:after:bg-current md:after:transition-[width] md:after:duration-300",
                activeView === view.key
                  ? "theme-nav-active bg-zinc-950/5 md:bg-transparent md:after:w-full"
                  : "text-zinc-800 hover:bg-zinc-950/5 hover:text-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-800 md:bg-transparent md:after:w-0 md:hover:bg-transparent md:hover:after:w-full md:focus-visible:after:w-full"
              ].join(" ")}
              href={view.href}
              onClick={() => setOpen(false)}
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
