import { i as isSameOriginAdminRequest, f as forbiddenResponse, g as getAdminUserFromRequest, a as getAdminServerSupabase } from '../../../chunks/auth_BZ3gyILm.mjs';
export { renderers } from '../../../renderers.mjs';

const allowedTables = /* @__PURE__ */ new Set(["skills", "projects", "experience", "certificates", "achievements", "activities", "education"]);
function hasPersistedId(value) {
  return typeof value === "string" && value.trim().length > 0 || typeof value === "number" && Number.isFinite(value);
}
function ensureRowMetadata(row, table) {
  const normalizedRow = table === "projects" || table === "achievements" ? {
    ...row,
    ...table === "projects" ? {
      subtitle: row.subtitle ?? "",
      title_font: typeof row.title_font === "string" && row.title_font.trim() ? row.title_font : "rostex"
    } : {},
    updated_at: typeof row.updated_at === "string" && row.updated_at.trim() ? row.updated_at : (/* @__PURE__ */ new Date()).toISOString()
  } : row;
  const rowWithId = hasPersistedId(normalizedRow.id) ? normalizedRow : {
    ...normalizedRow,
    id: crypto.randomUUID()
  };
  const rowWithCreatedAt = {
    ...rowWithId,
    created_at: typeof rowWithId.created_at === "string" && rowWithId.created_at.trim() ? rowWithId.created_at : (/* @__PURE__ */ new Date()).toISOString()
  };
  return table === "education" ? { ...rowWithCreatedAt, updated_at: (/* @__PURE__ */ new Date()).toISOString() } : rowWithCreatedAt;
}
const POST = async ({ request }) => {
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
      return ensureRowMetadata(row, String(table));
    }
    return row;
  }) : [];
  const { error } = await supabase.from(String(table)).upsert(normalizedRows, { onConflict: "id" });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
const DELETE = async ({ request }) => {
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
