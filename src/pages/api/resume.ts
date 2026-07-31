import type { APIRoute } from "astro";

import { fetchPortfolioContent } from "@/lib/server/content";

function withCacheBust(url: string) {
  const nextUrl = new URL(url);
  nextUrl.searchParams.set("downloadedAt", String(Date.now()));
  return nextUrl.toString();
}

export const GET: APIRoute = async () => {
  const content = await fetchPortfolioContent();
  const resumeUrl = content.intro.resume_url?.trim();

  if (!resumeUrl) {
    return new Response("Resume is not available.", { status: 404 });
  }

  const freshResumeUrl = withCacheBust(resumeUrl);
  const resumeResponse = await fetch(freshResumeUrl, { cache: "no-store" });

  if (!resumeResponse.ok || !resumeResponse.body) {
    return Response.redirect(freshResumeUrl, 302);
  }

  return new Response(resumeResponse.body, {
    headers: {
      "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
      "Content-Disposition": 'attachment; filename="Murshida-P-Resume.pdf"',
      "Content-Type": resumeResponse.headers.get("content-type") ?? "application/pdf",
      Pragma: "no-cache"
    }
  });
};
