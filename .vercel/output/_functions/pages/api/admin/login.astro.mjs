import { i as isSameOriginAdminRequest, f as forbiddenResponse, b as getPublicServerSupabase, A as ADMIN_ACCESS_COOKIE, c as ADMIN_REFRESH_COOKIE } from '../../../chunks/auth_BZ3gyILm.mjs';
export { renderers } from '../../../renderers.mjs';

const adminUsername = "murshidaprml";
const adminEmail = "murshidaprml@gmail.com";
const adminUserId = "ed3ed5a0-0864-4f8a-ab88-d5eaba2a5fb7";
const POST = async ({ request, cookies }) => {
  if (!isSameOriginAdminRequest(request)) {
    return forbiddenResponse();
  }
  const supabase = getPublicServerSupabase();
  if (!supabase) {
    return new Response(JSON.stringify({ error: "Supabase environment variables are missing." }), { status: 500 });
  }
  const { username, password } = await request.json();
  if (String(username).trim() !== adminUsername) {
    return new Response(JSON.stringify({ error: "Invalid admin credentials." }), { status: 401 });
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: String(password)
  });
  if (error || !data.session || data.user?.id !== adminUserId || data.user?.email !== adminEmail) {
    return new Response(JSON.stringify({ error: "Invalid admin credentials." }), { status: 401 });
  }
  const expires = data.session.expires_at ? new Date(data.session.expires_at * 1e3) : void 0;
  cookies.set(ADMIN_ACCESS_COOKIE, data.session.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    expires
  });
  cookies.set(ADMIN_REFRESH_COOKIE, data.session.refresh_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    expires
  });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
