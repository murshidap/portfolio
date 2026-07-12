import type { APIRoute } from "astro";

import {
  forbiddenResponse,
  getAdminServerSupabase,
  getAdminUserFromRequest,
  isSameOriginAdminRequest
} from "@/lib/server/auth";

const allowedFolders = new Set(["intro", "projects", "experience", "certificates", "achievements", "education"]);
const allowedImageTypes = new Map([
  ["image/avif", "avif"],
  ["image/gif", "gif"],
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"]
]);
const maxFileSize = 8 * 1024 * 1024;

export const POST: APIRoute = async ({ request }) => {
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

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "assets");

  if (!(file instanceof File)) {
    return new Response(JSON.stringify({ error: "File is required." }), { status: 400 });
  }

  if (!allowedFolders.has(folder)) {
    return new Response(JSON.stringify({ error: "Invalid upload folder." }), { status: 400 });
  }

  const extension = allowedImageTypes.get(file.type);
  if (!extension) {
    return new Response(JSON.stringify({ error: "Only JPG, PNG, GIF, WebP, and AVIF images are allowed." }), {
      status: 400
    });
  }

  if (file.size > maxFileSize) {
    return new Response(JSON.stringify({ error: "Images must be 8 MB or smaller." }), { status: 400 });
  }

  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error } = await supabase.storage.from("portfolio-assets").upload(path, arrayBuffer, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  const { data } = supabase.storage.from("portfolio-assets").getPublicUrl(path);
  return new Response(JSON.stringify({ url: data.publicUrl }), { status: 200 });
};
