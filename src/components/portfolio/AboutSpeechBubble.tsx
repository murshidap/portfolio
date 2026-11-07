import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

export default function AboutSpeechBubble({ paragraphs }: { paragraphs: string[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section aria-label="About me" className="about-speech-stage" id="about" ref={sectionRef}>
      <motion.article
        aria-label="Introduction"
        className="about-speech-bubble"
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 96 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <span aria-hidden="true" className="about-speech-tail" />
        <div className="about-speech-copy">
          {paragraphs.map((paragraph, index) => (
            <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
          ))}
        </div>
      </motion.article>
    </section>
  );
}
