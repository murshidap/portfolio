import { defaultContent } from "@/data/defaultContent";
import type { PortfolioContent } from "@/types/content";
import { getPublicServerSupabase, getServiceSupabase } from "@/lib/server/auth";

export async function fetchPortfolioContent(serverSide = false): Promise<PortfolioContent> {
  const supabase = serverSide ? getServiceSupabase() ?? getPublicServerSupabase() : getPublicServerSupabase();
  if (!supabase) {
    return defaultContent;
  }

  const [introResult, projectsResult, experienceResult, certificatesResult, educationResult] = await Promise.all([
    supabase.from("intro_content").select("*").limit(1).maybeSingle(),
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
    supabase.from("experience").select("*").order("created_at", { ascending: false }),
    supabase.from("certificates").select("*").order("created_at", { ascending: false }),
    supabase.from("education").select("*").order("created_at", { ascending: false })
  ]);

  return {
    intro: introResult.data ?? defaultContent.intro,
    projects: projectsResult.data?.length ? projectsResult.data : defaultContent.projects,
    experience: experienceResult.data?.length ? experienceResult.data : defaultContent.experience,
    certificates: certificatesResult.data?.length ? certificatesResult.data : defaultContent.certificates,
    education: educationResult.data?.length ? educationResult.data : defaultContent.education
  };
}
