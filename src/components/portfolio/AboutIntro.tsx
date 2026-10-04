import { useState } from "react";

export default function AboutIntro({ paragraphs }: { paragraphs: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const firstParagraphParts = paragraphs[0]?.match(/^(\S+\s+\S+)([\s\S]*)$/);

  return (
    <div className="font-open-sans-light space-y-3 text-left text-sm font-light leading-7 text-white/90 sm:text-base">
      {paragraphs.map((paragraph, index) => (
        <p className={index > 0 && !expanded ? "hidden md:block" : undefined} key={`${index}-${paragraph.slice(0, 24)}`}>
          {index === 0 && firstParagraphParts ? (
            <>
              <strong className="mr-[0.25em] text-xl font-bold text-white sm:text-2xl">{firstParagraphParts[1]}</strong>
              {firstParagraphParts[2]}
            </>
          ) : (
            paragraph
          )}
        </p>
      ))}
      {paragraphs.length > 1 ? (
        <button
          aria-expanded={expanded}
          className="mt-1 text-sm font-medium text-white/75 underline decoration-white/40 underline-offset-4 hover:text-white md:hidden"
          onClick={() => setExpanded((current) => !current)}
          type="button"
        >
          {expanded ? "Less..." : "More..."}
        </button>
      ) : null}
    </div>
  );
}
