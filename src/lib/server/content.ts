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

function normalizeActivities(items: PortfolioContent["activities"] | null | undefined) {
  const sourceItems = items ?? defaultContent.activities;

  return sourceItems.map((item, index) => ({
    id: item?.id || `activity-${index + 1}`,
    title: item?.title || `Activity ${index + 1}`,
    image_url: item?.image_url || ""
  }));
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
    activitiesResult,
    educationResult
  ] = await Promise.all([
    supabase.from("intro_content").select("*").limit(1).maybeSingle(),
    supabase.from("skills").select("*").order("created_at", { ascending: false }),
    supabase.from("projects").select("*").order("created_at", { ascending: true }),
    supabase.from("experience").select("*").order("created_at", { ascending: false }),
    supabase.from("certificates").select("*").order("created_at", { ascending: false }),
    supabase.from("achievements").select("*").order("created_at", { ascending: false }),
    supabase.from("activities").select("*").order("id", { ascending: true }),
    supabase.from("education").select("*").order("created_at", { ascending: false })
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
    experience: experienceResult.data ?? defaultContent.experience,
    certificates: certificatesResult.data ?? defaultContent.certificates,
    achievements: achievementsResult.data ?? defaultContent.achievements,
    activities: normalizeActivities(activitiesResult.data),
    education: educationResult.data ?? defaultContent.education
  };
}
