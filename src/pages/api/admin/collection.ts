import type { APIRoute } from "astro";
import { isValidProjectCardColor, normalizeProjectCardColor } from "@/data/projectColors";

import {
  forbiddenResponse,
  getAdminServerSupabase,
  getAdminUserFromRequest,
  isSameOriginAdminRequest
} from "@/lib/server/auth";

const allowedTables = new Set(["skills", "projects", "experience", "certificates", "achievements", "education"]);
function hasPersistedId(value: unknown) {
  return (typeof value === "string" && value.trim().length > 0) || (typeof value === "number" && Number.isFinite(value));
}

function ensureRowMetadata(row: Record<string, unknown>, table: string, index: number) {
  const { updated_at: existingUpdatedAt, ...rowWithoutUpdatedAt } = row;
  const rowWithoutExperienceDescription = table === "experience"
    ? Object.fromEntries(Object.entries(rowWithoutUpdatedAt).filter(([key]) => key !== "description"))
    : rowWithoutUpdatedAt;
  const normalizedRow = {
    ...(table === "experience" ? rowWithoutExperienceDescription : row),
    ...(table === "projects"
      ? {
          subtitle: row.subtitle ?? "",
          card_color: normalizeProjectCardColor(row.card_color)
        }
      : {}),
    updated_at: typeof existingUpdatedAt === "string" && existingUpdatedAt.trim()
      ? existingUpdatedAt
      : new Date().toISOString()
  };
  const rowWithDisplayOrder = { ...normalizedRow, display_order: index };
  const rowWithId = hasPersistedId(rowWithDisplayOrder.id)
    ? rowWithDisplayOrder
    : {
        ...rowWithDisplayOrder,
        id: crypto.randomUUID()
      };

  const rowWithCreatedAt = {
    ...rowWithId,
    created_at:
      typeof rowWithId.created_at === "string" && rowWithId.created_at.trim()
        ? rowWithId.created_at
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

  if (
    table === "certificates" &&
    Array.isArray(rows) &&
    rows.some((row) =>
      row &&
      typeof row === "object" &&
      "asset_url" in row &&
      row.asset_url !== null &&
      row.asset_url !== "" &&
      (typeof row.asset_url !== "string" || !/\.(?:avif|gif|jpe?g|png|webp)(?:[?#].*)?$/i.test(row.asset_url.trim()))
    )
  ) {
    return new Response(JSON.stringify({ error: "Certificate files must be image URLs." }), { status: 400 });
  }

  if (
    table === "projects" &&
    Array.isArray(rows) &&
    rows.some((row) =>
      row &&
      typeof row === "object" &&
      "card_color" in row &&
      !isValidProjectCardColor(row.card_color)
    )
  ) {
    return new Response(JSON.stringify({ error: "Project card colors must be six-digit hex values." }), { status: 400 });
  }

  const normalizedRows = Array.isArray(rows) ? rows.filter(Boolean).map((row, index) => {
    if (row && typeof row === "object") {
      return ensureRowMetadata(row as Record<string, unknown>, String(table), index);
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
