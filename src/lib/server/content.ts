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

  const [introResult, projectsResult, experienceResult, certificatesResult, achievementsResult, educationResult] = await Promise.all([
    supabase.from("intro_content").select("*").limit(1).maybeSingle(),
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
    supabase.from("experience").select("*").order("created_at", { ascending: false }),
    supabase.from("certificates").select("*").order("created_at", { ascending: false }),
    supabase.from("achievements").select("*").order("created_at", { ascending: false }),
    supabase.from("education").select("*").order("created_at", { ascending: false })
  ]);

  return {
    intro: introResult.data ?? defaultContent.intro,
    projects: projectsResult.data?.length
      ? projectsResult.data.map((project) => ({
          ...project,
          screenshot_urls: normalizeScreenshotUrls(project.screenshot_urls)
        }))
      : defaultContent.projects,
    experience: experienceResult.data?.length ? experienceResult.data : defaultContent.experience,
    certificates: certificatesResult.data?.length ? certificatesResult.data : defaultContent.certificates,
    achievements: achievementsResult.data?.length ? achievementsResult.data : defaultContent.achievements,
    education: educationResult.data?.length ? educationResult.data : defaultContent.education
  };
}
