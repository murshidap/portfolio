import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

import { ConstellationWidget } from "@/components/portfolio/ConstellationWidget";
import { ContactModal } from "@/components/portfolio/ContactActions";
import SkillsMarquee from "@/components/portfolio/SkillsMarquee";
import { DEFAULT_THEME_INDEX, PORTFOLIO_THEMES } from "@/components/portfolio/themeSystem";
import { Button } from "@/components/ui/button";
import type { IntroContent, SkillItem } from "@/types/content";

export default function HomePage({ intro, skills }: { intro: IntroContent; skills: SkillItem[] }) {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const roleWords = intro.role.trim() ? intro.role.trim().split(/\s+/) : ["Web", "Developer"];
  const roleScalePercent =
    typeof intro.role_scale_percent === "number" && Number.isFinite(intro.role_scale_percent)
      ? Math.min(150, Math.max(60, intro.role_scale_percent))
      : 100;
  const roleScale = roleScalePercent / 100;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="relative z-0 grid min-h-[calc(100svh-6rem)] w-full content-start items-start gap-4 py-4 md:content-normal md:items-end md:gap-8 lg:-translate-y-4 lg:grid-cols-[minmax(0,1fr)_minmax(420px,1fr)]"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="font-faded-display absolute left-1/2 top-0 flex w-max -translate-x-1/2 flex-col items-center text-center text-[clamp(6rem,22vw,20rem)] font-black leading-[0.82] tracking-[0.02em] text-zinc-950/[0.035]">
          {roleWords.map((word, index) => (
            <span className="block text-center" key={`${word}-backdrop-${index}`}>
              {word.toUpperCase()}
            </span>
          ))}
          {Array.from({ length: 24 }, (_, index) => (
            <span className="home-role-outline block text-center md:hidden" key={`role-outline-${index}`}>
              {roleWords[roleWords.length - 1].toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      <ContactModal onClose={() => setContactModalOpen(false)} open={contactModalOpen} />

      <section className="order-1 relative min-h-[420px] lg:col-span-2">
        <div className="pointer-events-none flex min-w-0 justify-center">
          <div className="relative mt-24 flex w-full max-w-[680px] flex-col items-center md:mt-8 md:max-w-[760px] lg:mt-0 lg:max-w-[860px]">
            <div
              className="home-role-heading font-rostex-regular relative z-20 mb-0 w-full break-words text-center font-black leading-[0.82] tracking-[0.02em] text-zinc-950 md:mb-[-1.5rem] md:translate-y-4 lg:mb-[-2.5rem] lg:translate-y-14"
              style={{
                fontSize: `clamp(${3.4 * roleScale}rem, ${9 * roleScale}vw, ${8.2 * roleScale}rem)`
              }}
            >
              {roleWords.map((word, index) =>
                index === roleWords.length - 1 ? (
                  <span key={`${word}-${index}`} className="block w-full text-center">
                    <span className="relative left-1/2 block w-max -translate-x-1/2">
                      <span className="inline-block">{word.toUpperCase()}</span>
                      <ConstellationWidget activeIndex={DEFAULT_THEME_INDEX} themes={PORTFOLIO_THEMES} />
                    </span>
                  </span>
                ) : (
                  <span key={`${word}-${index}`} className={index === 0 ? "block text-[1.12em]" : "block"}>
                    {word.toUpperCase()}
                  </span>
                )
              )}
            </div>
            <div className="theme-portrait-orb absolute bottom-[8%] left-[10%] right-[10%] top-[6%]" />
            <div className="relative z-30 -top-3 -mt-8 w-full md:top-auto md:-mt-40 lg:-mt-48">
              <div className="pointer-events-none absolute bottom-[6%] left-1/2 h-[64%] w-[58%] -translate-x-1/2 rounded-full bg-black/30 blur-3xl" />
              <motion.img
                alt="Murshida portrait"
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 mx-auto w-full max-w-[320px] object-contain grayscale md:max-w-[700px] lg:max-w-[800px]"
                initial={{ opacity: 0, y: 28 }}
                src={intro.profile_image_url || "/images/profile-picture.png"}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
              <div
                aria-hidden="true"
                className="h-px w-full bg-gradient-to-r from-transparent via-black/95 to-transparent md:hidden"
              />
            </div>
          </div>
        </div>
      </section>

      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="pointer-events-auto order-3 relative z-20 -top-3 mx-auto max-w-[31rem] text-center md:top-auto md:mx-0 md:text-left lg:absolute lg:left-16 lg:top-[calc(14rem_+_clamp(5.576rem,_14.76vw,_13.448rem))] xl:left-24"
        initial={{ opacity: 0, x: -22 }}
        transition={{ duration: 0.5, delay: 0.18, ease: "easeOut" }}
      >
        <div className="mx-auto w-max max-w-full md:mx-0 md:w-auto">
          <p className="w-max max-w-full whitespace-nowrap font-rostex-regular text-[clamp(1.25rem,2.8vw,2.2rem)] uppercase leading-[0.95] tracking-[0.08em] text-zinc-950">
            <span>MURSHIDA</span>
            <span className="ml-[0.5em]">P</span>
          </p>
          <div className="mt-3 grid w-full grid-cols-[1.45fr_1fr] gap-2 md:mt-6 md:w-auto md:flex md:flex-wrap md:gap-3">
            <a className="min-w-0" download href={intro.resume_url ? "/api/resume" : "#"}>
              <Button className="h-9 w-full min-w-0 px-2 text-xs md:h-11 md:w-auto md:px-5 md:text-sm" disabled={!intro.resume_url} type="button">
                <span>Get Resume</span>
                <ArrowUpRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
            </a>
            <Button className="h-9 w-full min-w-0 px-2 text-xs md:h-11 md:w-auto md:flex-none md:px-5 md:text-sm" onClick={() => setContactModalOpen(true)} type="button" variant="secondary">
              Connect
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="order-4 relative z-20 -mt-2 w-full md:mt-0 lg:absolute lg:inset-x-0 lg:top-[calc(22rem_+_clamp(5.576rem,_14.76vw,_13.448rem))]">
        <SkillsMarquee skills={skills} />
      </div>
    </motion.div>
  );
}
