import { createClient, type User } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = import.meta.env.PUBLIC_ADMIN_EMAIL ?? "murshidaprml@gmail.com";
const adminUserId = import.meta.env.ADMIN_USER_ID ?? "ed3ed5a0-0864-4f8a-ab88-d5eaba2a5fb7";

export const ADMIN_ACCESS_COOKIE = "portfolio-admin-access-token";
export const ADMIN_REFRESH_COOKIE = "portfolio-admin-refresh-token";

export function isSameOriginAdminRequest(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }

  try {
    const originUrl = new URL(origin);
    const requestUrl = new URL(request.url);
    const forwardedHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();

    if (!forwardedHost) {
      return originUrl.origin === requestUrl.origin;
    }

    const protocol = forwardedProtocol ?? requestUrl.protocol.replace(":", "");
    return originUrl.protocol === `${protocol}:` && originUrl.host === forwardedHost;
  } catch {
    return false;
  }
}

export function forbiddenResponse() {
  return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
}

export function getPublicServerSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export function getServiceSupabase() {
  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export function getAdminServerSupabase(request: Request) {
  const serviceClient = getServiceSupabase();
  if (serviceClient) {
    return serviceClient;
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  const accessToken = readCookie(request.headers.get("cookie") ?? "", ADMIN_ACCESS_COOKIE);
  if (!accessToken) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });
}

export async function getAdminUserFromRequest(request: Request): Promise<User | null> {
  const supabase = getPublicServerSupabase();
  if (!supabase) {
    return null;
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  const accessToken = readCookie(cookieHeader, ADMIN_ACCESS_COOKIE);
  if (!accessToken) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error) {
    return null;
  }

  const user = data.user ?? null;
  if (!user || user.id !== adminUserId || user.email !== adminEmail) {
    return null;
  }

  return user;
}

export function readCookie(cookieHeader: string, name: string) {
  const cookie = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.slice(name.length + 1));
}
