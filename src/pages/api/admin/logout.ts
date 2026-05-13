import type { APIRoute } from "astro";

import { ADMIN_ACCESS_COOKIE, ADMIN_REFRESH_COOKIE } from "@/lib/server/auth";

export const POST: APIRoute = async ({ cookies }) => {
  cookies.delete(ADMIN_ACCESS_COOKIE, { path: "/" });
  cookies.delete(ADMIN_REFRESH_COOKIE, { path: "/" });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
