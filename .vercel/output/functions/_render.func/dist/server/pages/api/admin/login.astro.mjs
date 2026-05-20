import { b as getMissingSupabaseEnvVars, A as ADMIN_ACCESS_COOKIE, c as ADMIN_REFRESH_COOKIE, d as getPublicServerSupabase } from '../../../chunks/auth_4lUvT1K1.mjs';
export { renderers } from '../../../renderers.mjs';

const adminUsername = "murshida-admin";
const adminEmail = "admin@example.com";
const POST = async ({ request, cookies }) => {
  const supabase = getPublicServerSupabase();
  if (!supabase) {
    return new Response(
      JSON.stringify({
        error: `Supabase environment variables are missing: ${getMissingSupabaseEnvVars().join(", ")}`
      }),
      { status: 500 }
    );
  }
  const { username, password } = await request.json();
  if (String(username).trim() !== adminUsername) {
    return new Response(JSON.stringify({ error: "Username does not match the configured admin account." }), {
      status: 401
    });
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: String(password)
  });
  if (error || !data.session) {
    return new Response(JSON.stringify({ error: error?.message ?? "Login failed." }), { status: 401 });
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
