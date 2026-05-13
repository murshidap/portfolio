import type { APIRoute } from "astro";

import { getAdminUserFromRequest, getServiceSupabase } from "@/lib/server/auth";

export const POST: APIRoute = async ({ request }) => {
  const user = await getAdminUserFromRequest(request);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const supabase = getServiceSupabase();
  if (!supabase) {
    return new Response(JSON.stringify({ error: "Supabase service role key is missing." }), { status: 500 });
  }

  const payload = await request.json();
  const { error } = await supabase.from("intro_content").upsert(payload, { onConflict: "id" });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
