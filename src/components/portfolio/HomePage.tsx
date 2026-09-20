import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

import { ConstellationWidget } from "@/components/portfolio/ConstellationWidget";
import { ContactModal } from "@/components/portfolio/ContactActions";
import { DEFAULT_THEME_INDEX, PORTFOLIO_THEMES } from "@/components/portfolio/themeSystem";
import { Button } from "@/components/ui/button";
import type { IntroContent } from "@/types/content";

export default function HomePage({ intro }: { intro: IntroContent }) {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const roleWords = intro.role.trim() ? intro.role.trim().split(/\s+/) : ["Web", "Developer"];

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="relative z-0 -mt-8 grid flex-1 items-end gap-8 md:-mt-12 lg:-mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(420px,1fr)]"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <ContactModal email={intro.email} onClose={() => setContactModalOpen(false)} open={contactModalOpen} />

      <section className="order-1 relative z-10 min-h-[420px] lg:absolute lg:inset-x-0 lg:top-[4.5rem] lg:min-h-0">
        <div className="pointer-events-none flex justify-center">
          <div className="relative mt-10 flex w-full max-w-[680px] flex-col items-center md:mt-14 md:max-w-[760px] lg:mt-0 lg:max-w-[860px]">
            <div className="font-rostex-regular relative z-20 mb-[-1.5rem] translate-y-8 text-center text-[clamp(3.4rem,9vw,8.2rem)] font-black leading-[0.82] tracking-[0.02em] text-zinc-950 lg:mb-[-2.5rem] lg:translate-y-14">
              {roleWords.map((word, index) =>
                index === roleWords.length - 1 ? (
                  <span key={`${word}-${index}`} className="relative inline-block">
                    <span className="inline-block">{word.toUpperCase()}</span>
                    <ConstellationWidget activeIndex={DEFAULT_THEME_INDEX} themes={PORTFOLIO_THEMES} />
                  </span>
                ) : (
                  <span key={`${word}-${index}`} className={index === 0 ? "block text-[1.12em]" : "block"}>
                    {word.toUpperCase()}
                  </span>
                )
              )}
            </div>
            <div className="theme-portrait-orb absolute bottom-[8%] left-[10%] right-[10%] top-[6%]" />
            <div className="relative z-30 -mt-20 w-full md:-mt-24 lg:-mt-32">
              <div className="pointer-events-none absolute bottom-[6%] left-1/2 h-[64%] w-[58%] -translate-x-1/2 rounded-full bg-black/30 blur-3xl" />
              <motion.img
                alt="Murshida portrait"
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 mx-auto w-full max-w-[620px] object-contain grayscale md:max-w-[700px] lg:max-w-[800px]"
                initial={{ opacity: 0, y: 28 }}
                src={intro.profile_image_url || "/images/profile-picture.png"}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </section>

      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="pointer-events-auto order-3 relative z-20 max-w-[31rem] text-left lg:absolute lg:bottom-4 lg:left-16 xl:bottom-8 xl:left-24"
        initial={{ opacity: 0, x: -22 }}
        transition={{ duration: 0.5, delay: 0.18, ease: "easeOut" }}
      >
        <p className="font-rostex-regular text-[clamp(1.25rem,2.8vw,2.2rem)] uppercase leading-[0.95] tracking-[0.08em] text-zinc-950">
          MURSHIDA P
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a download href={intro.resume_url ? "/api/resume" : "#"}>
            <Button disabled={!intro.resume_url} type="button">
              <span>Get Resume</span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </a>
          <Button onClick={() => setContactModalOpen(true)} type="button" variant="secondary">
            Connect
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
