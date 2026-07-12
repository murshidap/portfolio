import type { APIRoute } from "astro";

import {
  forbiddenResponse,
  getAdminServerSupabase,
  getAdminUserFromRequest,
  isSameOriginAdminRequest
} from "@/lib/server/auth";

export const POST: APIRoute = async ({ request }) => {
  if (!isSameOriginAdminRequest(request)) {
    return forbiddenResponse();
  }

  const user = await getAdminUserFromRequest(request);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const supabase = getAdminServerSupabase(request);
  if (!supabase) {
    return new Response(JSON.stringify({ error: "Supabase server credentials are missing." }), { status: 500 });
  }

  const payload = await request.json();
  const { error } = await supabase.from("intro_content").upsert(payload, { onConflict: "id" });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
