const ADMIN_ACCESS_COOKIE = "murshida-admin-access-token";
const ADMIN_REFRESH_COOKIE = "murshida-admin-refresh-token";
function getPublicServerSupabase() {
  {
    return null;
  }
}
function getServiceSupabase() {
  {
    return null;
  }
}
async function getAdminUserFromRequest(request) {
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
  return data.user ?? null;
}
function readCookie(cookieHeader, name) {
  const cookie = cookieHeader.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`));
  if (!cookie) {
    return null;
  }
  return decodeURIComponent(cookie.slice(name.length + 1));
}
function getMissingSupabaseEnvVars() {
  const missing = [];
  {
    missing.push("PUBLIC_SUPABASE_URL");
  }
  {
    missing.push("PUBLIC_SUPABASE_ANON_KEY");
  }
  return missing;
}

export { ADMIN_ACCESS_COOKIE as A, getServiceSupabase as a, getMissingSupabaseEnvVars as b, ADMIN_REFRESH_COOKIE as c, getPublicServerSupabase as d, getAdminUserFromRequest as g };
