import type { APIRoute } from "astro";

import {
  forbiddenResponse,
  getAdminServerSupabase,
  getAdminUserFromRequest,
  isSameOriginAdminRequest
} from "@/lib/server/auth";

const allowedTables = new Set(["skills", "projects", "experience", "certificates", "achievements", "activities", "education"]);
function hasPersistedId(value: unknown) {
  return (typeof value === "string" && value.trim().length > 0) || (typeof value === "number" && Number.isFinite(value));
}

function ensureRowMetadata(row: Record<string, unknown>, table: string) {
  const normalizedProject = table === "projects"
    ? {
        ...row,
        subtitle: row.subtitle ?? "",
        updated_at: typeof row.updated_at === "string" && row.updated_at.trim() ? row.updated_at : new Date().toISOString()
      }
    : row;
  const normalizedRow = hasPersistedId(row.id)
    ? normalizedProject
    : {
        ...normalizedProject,
        id: crypto.randomUUID()
      };

  const rowWithCreatedAt = {
    ...normalizedRow,
    created_at:
      typeof normalizedRow.created_at === "string" && normalizedRow.created_at.trim()
        ? normalizedRow.created_at
        : new Date().toISOString(),
  };

  return table === "education" ? { ...rowWithCreatedAt, updated_at: new Date().toISOString() } : rowWithCreatedAt;
}

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

  const { table, rows } = await request.json();
  if (!allowedTables.has(String(table))) {
    return new Response(JSON.stringify({ error: "Invalid collection." }), { status: 400 });
  }

  const normalizedRows = Array.isArray(rows) ? rows.filter(Boolean).map((row) => {
    if (row && typeof row === "object") {
      return ensureRowMetadata(row as Record<string, unknown>, String(table));
    }

    return row;
  }) : [];
  const { error } = await supabase.from(String(table)).upsert(normalizedRows, { onConflict: "id" });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
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
