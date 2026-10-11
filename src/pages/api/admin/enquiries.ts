import type { APIRoute } from "astro";

import {
  forbiddenResponse,
  getAdminServerSupabase,
  getAdminUserFromRequest,
  isSameOriginAdminRequest
} from "@/lib/server/auth";

export const GET: APIRoute = async ({ request }) => {
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

  const { data, error } = await supabase
    .from("enquiries")
    .select("id, full_name, contact_number, email, company, message, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: "Enquiries could not be loaded." }), { status: 500 });
  }

  return new Response(JSON.stringify({ enquiries: data }), {
    status: 200,
    headers: { "Cache-Control": "no-store" }
  });
};

export const DELETE: APIRoute = async ({ request }) => {
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

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body." }), { status: 400 });
  }

  const id = payload && typeof payload === "object" && "id" in payload ? payload.id : null;
  if (typeof id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return new Response(JSON.stringify({ error: "Invalid enquiry ID." }), { status: 400 });
  }

  const { data, error } = await supabase.from("enquiries").delete().eq("id", id).select("id").maybeSingle();
  if (error) {
    return new Response(JSON.stringify({ error: "Enquiry could not be deleted." }), { status: 500 });
  }
  if (!data) {
    return new Response(JSON.stringify({ error: "Enquiry not found." }), { status: 404 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
