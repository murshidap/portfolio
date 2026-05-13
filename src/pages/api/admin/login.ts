import type { APIRoute } from "astro";

import { ADMIN_ACCESS_COOKIE, ADMIN_REFRESH_COOKIE, getPublicServerSupabase } from "@/lib/server/auth";

const adminUsername = import.meta.env.PUBLIC_ADMIN_USERNAME ?? "murshida-admin";
const adminEmail = import.meta.env.PUBLIC_ADMIN_EMAIL ?? "admin@example.com";

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = getPublicServerSupabase();
  if (!supabase) {
    return new Response(JSON.stringify({ error: "Supabase environment variables are missing." }), { status: 500 });
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

  const expires = data.session.expires_at ? new Date(data.session.expires_at * 1000) : undefined;

  cookies.set(ADMIN_ACCESS_COOKIE, data.session.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: import.meta.env.PROD,
    path: "/",
    expires
  });
  cookies.set(ADMIN_REFRESH_COOKIE, data.session.refresh_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: import.meta.env.PROD,
    path: "/",
    expires
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
