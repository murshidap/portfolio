import type { SkillItem } from "@/types/content";

function SkillCard({ skill }: { skill: SkillItem }) {
  return (
    <article className="skills-marquee-card shrink-0 rounded-full border border-zinc-950/15 bg-white/70 px-3 py-2 shadow-sm backdrop-blur-sm">
      {skill.icon_url ? (
        <img alt="" className="h-5 w-5 shrink-0 object-contain" src={skill.icon_url} />
      ) : (
        <span aria-hidden="true" className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-zinc-950 text-[9px] font-semibold text-white">
          {skill.title.slice(0, 1).toUpperCase()}
        </span>
      )}
      <span className="font-open-sans-light whitespace-nowrap text-xs font-semibold tracking-normal text-zinc-800 sm:text-sm">
        {skill.title}
      </span>
    </article>
  );
}

function SkillRail({ direction, skills }: { direction: "left" | "right"; skills: SkillItem[] }) {
  // A generous repeat count keeps the rail full even on wide screens and makes
  // the halfway point of the animation an identical sequence.
  const repeatedSkills = Array.from({ length: 12 }, () => skills).flat();

  return (
    <div className="skills-marquee-rail" aria-label="Skills">
      <div className={`skills-marquee-track skills-marquee-track-${direction}`}>
        {repeatedSkills.map((skill, index) => (
          <SkillCard key={`${direction}-${skill.id}-${index}`} skill={skill} />
        ))}
      </div>
    </div>
  );
}

export default function SkillsMarquee({ skills }: { skills: SkillItem[] }) {
  const validSkills = skills.filter((skill) => skill.title.trim() || skill.icon_url.trim());

  if (validSkills.length === 0) return null;

  const splitIndex = Math.ceil(validSkills.length / 2);
  const upperSkills = validSkills.slice(0, splitIndex);
  const lowerSkills = validSkills.slice(splitIndex);

  return (
    <aside className="skills-marquee pointer-events-auto" aria-label="Skills">
      <SkillRail direction="left" skills={upperSkills} />
      <SkillRail direction="right" skills={lowerSkills.length ? lowerSkills : upperSkills} />
    </aside>
  );
}
