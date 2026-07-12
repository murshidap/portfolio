import type { APIRoute } from "astro";

import {
  ADMIN_ACCESS_COOKIE,
  ADMIN_REFRESH_COOKIE,
  forbiddenResponse,
  getPublicServerSupabase,
  isSameOriginAdminRequest
} from "@/lib/server/auth";

const adminUsername = import.meta.env.PUBLIC_ADMIN_USERNAME ?? "murshidaprml";
const adminEmail = import.meta.env.PUBLIC_ADMIN_EMAIL ?? "murshidaprml@gmail.com";
const adminUserId = import.meta.env.ADMIN_USER_ID ?? "ed3ed5a0-0864-4f8a-ab88-d5eaba2a5fb7";

export const POST: APIRoute = async ({ request, cookies }) => {
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
