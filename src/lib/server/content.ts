import { defaultContent } from "@/data/defaultContent";
import type { PortfolioContent } from "@/types/content";
import { getPublicServerSupabase, getServiceSupabase } from "@/lib/server/auth";

function normalizeScreenshotUrls(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export async function fetchPortfolioContent(serverSide = false): Promise<PortfolioContent> {
  const supabase = serverSide ? getServiceSupabase() ?? getPublicServerSupabase() : getPublicServerSupabase();
  if (!supabase) {
    return defaultContent;
  }

  const [
    introResult,
    skillsResult,
    projectsResult,
    experienceResult,
    certificatesResult,
    achievementsResult,
    educationResult
  ] = await Promise.all([
    supabase.from("intro_content").select("*").limit(1).maybeSingle(),
    supabase.from("skills").select("*").order("display_order", { ascending: true }),
    supabase.from("projects").select("*").order("display_order", { ascending: true }),
    supabase.from("experience").select("*").order("display_order", { ascending: true }),
    supabase.from("certificates").select("*").order("display_order", { ascending: true }),
    supabase.from("achievements").select("*").order("display_order", { ascending: true }),
    supabase.from("education").select("*").order("display_order", { ascending: true })
  ]);

  return {
    intro: introResult.data ?? defaultContent.intro,
    skills: skillsResult.data ?? defaultContent.skills,
    projects: projectsResult.data
      ? projectsResult.data.map((project) => ({
          ...project,
          subtitle: project.subtitle ?? "",
          screenshot_urls: normalizeScreenshotUrls(project.screenshot_urls)
        }))
      : defaultContent.projects,
    experience: experienceResult.data
      ? experienceResult.data.map((item) =>
          Object.fromEntries(Object.entries(item).filter(([key]) => key !== "description"))
        )
      : defaultContent.experience,
    certificates: certificatesResult.data ?? defaultContent.certificates,
    achievements: achievementsResult.data ?? defaultContent.achievements,
    education: educationResult.data ?? defaultContent.education
  };
}
