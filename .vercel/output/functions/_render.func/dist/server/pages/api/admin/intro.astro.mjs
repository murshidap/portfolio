import { g as getAdminUserFromRequest, a as getServiceSupabase } from '../../../chunks/auth_4lUvT1K1.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
