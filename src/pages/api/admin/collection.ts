import type { APIRoute } from "astro";

import { getAdminUserFromRequest, getServiceSupabase } from "@/lib/server/auth";

const allowedTables = new Set(["projects", "experience", "certificates", "education"]);

export const POST: APIRoute = async ({ request }) => {
  const user = await getAdminUserFromRequest(request);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const supabase = getServiceSupabase();
  if (!supabase) {
    return new Response(JSON.stringify({ error: "Supabase service role key is missing." }), { status: 500 });
  }

  const { table, rows } = await request.json();
  if (!allowedTables.has(String(table))) {
    return new Response(JSON.stringify({ error: "Invalid collection." }), { status: 400 });
  }

  const { error } = await supabase.from(String(table)).upsert(Array.isArray(rows) ? rows : []);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};

export const DELETE: APIRoute = async ({ request }) => {
  const user = await getAdminUserFromRequest(request);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const supabase = getServiceSupabase();
  if (!supabase) {
    return new Response(JSON.stringify({ error: "Supabase service role key is missing." }), { status: 500 });
  }

  const { table, id } = await request.json();
  if (!allowedTables.has(String(table))) {
    return new Response(JSON.stringify({ error: "Invalid collection." }), { status: 400 });
  }

  const { error } = await supabase.from(String(table)).delete().eq("id", String(id));
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
