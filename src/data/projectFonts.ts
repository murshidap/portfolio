export const projectFonts = [
  { id: "rostex", label: "Rostex Regular", family: "Rostex Regular" },
  { id: "brigends", label: "Brigends Expanded", family: "Brigends Expanded" },
  { id: "crows-driven", label: "Crows Driven", family: "Crows Driven" },
  { id: "football-stage", label: "Football Stage", family: "Football Stage" },
  { id: "galantic", label: "Galantic", family: "Galantic" },
  { id: "glacial-indifference", label: "Glacial Indifference", family: "Glacial Indifference" },
  { id: "open-sans", label: "Open Sans", family: "Open Sans" },
  { id: "rostex-oblique", label: "Rostex Oblique", family: "Rostex Oblique" },
  { id: "rostex-outline", label: "Rostex Outline", family: "Rostex Outline" },
  { id: "rostex-oblique-outline", label: "Rostex Oblique Outline", family: "Rostex Oblique Outline" },
  { id: "anton", label: "Anton", family: "Anton" },
  { id: "bree-serif", label: "Bree Serif", family: "Bree Serif" },
  { id: "child-hood", label: "Child Hood", family: "Child Hood" },
  { id: "corpta", label: "Corpta", family: "Corpta" },
  { id: "droid-serif", label: "Droid Serif", family: "Droid Serif" },
  { id: "exo", label: "Exo", family: "Exo" },
  { id: "gondens", label: "Gondens", family: "Gondens" },
  { id: "gopron", label: "Gopron", family: "Gopron" },
  { id: "groomy", label: "Groomy", family: "Groomy" },
  { id: "marlboro", label: "Marlboro", family: "Marlboro" },
  { id: "montserrat", label: "Montserrat", family: "Montserrat" },
  { id: "motion-control", label: "Motion Control", family: "Motion Control" },
  { id: "poppins", label: "Poppins", family: "Poppins" },
  { id: "retro-floral", label: "Retro Floral", family: "Retro Floral" },
  { id: "thrust", label: "Thrust", family: "Thrust" }
] as const;

export type ProjectFontId = (typeof projectFonts)[number]["id"];

export function getProjectFontFamily(fontId: string | null | undefined) {
  return projectFonts.find((font) => font.id === fontId)?.family ?? projectFonts[0].family;
}
