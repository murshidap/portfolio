import { g as getAdminUserFromRequest, a as getServiceSupabase } from '../../../chunks/auth_hH7cwaQS.mjs';
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
  const formData = await request.formData();
  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "assets");
  if (!(file instanceof File)) {
    return new Response(JSON.stringify({ error: "File is required." }), { status: 400 });
  }
  const extension = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const arrayBuffer = await file.arrayBuffer();
  const { error } = await supabase.storage.from("portfolio-assets").upload(path, arrayBuffer, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type
  });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
  const { data } = supabase.storage.from("portfolio-assets").getPublicUrl(path);
  return new Response(JSON.stringify({ url: data.publicUrl }), { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
