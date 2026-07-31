import { i as isSameOriginAdminRequest, f as forbiddenResponse, g as getAdminUserFromRequest, a as getAdminServerSupabase } from '../../../chunks/auth_B79Sfj4C.mjs';
import { d as defaultContent } from '../../../chunks/defaultContent_wXX362n0.mjs';
export { renderers } from '../../../renderers.mjs';

const allowedFolders = /* @__PURE__ */ new Set(["intro", "skills", "projects", "experience", "certificates", "achievements", "education", "resume"]);
const allowedImageTypes = /* @__PURE__ */ new Map([
  ["image/avif", "avif"],
  ["image/gif", "gif"],
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"]
]);
const maxImageFileSize = 8 * 1024 * 1024;
const maxResumeFileSize = 10 * 1024 * 1024;
function getStoragePathFromPublicUrl(publicUrl) {
  try {
    const pathname = new URL(publicUrl).pathname;
    const marker = "/storage/v1/object/public/portfolio-assets/";
    const markerIndex = pathname.indexOf(marker);
    if (markerIndex === -1) {
      return null;
    }
    return decodeURIComponent(pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
}
const POST = async ({ request }) => {
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
  const currentUrl = String(formData.get("currentUrl") ?? "");
  if (!(file instanceof File)) {
    return new Response(JSON.stringify({ error: "File is required." }), { status: 400 });
  }
  if (!allowedFolders.has(folder)) {
    return new Response(JSON.stringify({ error: "Invalid upload folder." }), { status: 400 });
  }
  const isResumeUpload = folder === "resume";
  const extension = isResumeUpload ? "pdf" : allowedImageTypes.get(file.type);
  if (isResumeUpload && file.type !== "application/pdf") {
    return new Response(JSON.stringify({ error: "Only PDF resumes are allowed." }), { status: 400 });
  }
  if (!extension) {
    return new Response(JSON.stringify({ error: "Only JPG, PNG, GIF, WebP, and AVIF images are allowed." }), {
      status: 400
    });
  }
  if (isResumeUpload && file.size > maxResumeFileSize) {
    return new Response(JSON.stringify({ error: "Resume PDFs must be 10 MB or smaller." }), { status: 400 });
  }
  if (!isResumeUpload && file.size > maxImageFileSize) {
    return new Response(JSON.stringify({ error: "Images must be 8 MB or smaller." }), { status: 400 });
  }
  const path = isResumeUpload ? `resume/resume-${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}` : `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const arrayBuffer = await file.arrayBuffer();
  const { error } = await supabase.storage.from("portfolio-assets").upload(path, arrayBuffer, {
    cacheControl: isResumeUpload ? "0" : "3600",
    upsert: false,
    contentType: file.type
  });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
  const { data } = supabase.storage.from("portfolio-assets").getPublicUrl(path);
  const url = isResumeUpload ? `${data.publicUrl}?v=${Date.now()}` : data.publicUrl;
  if (isResumeUpload) {
    const currentPath = getStoragePathFromPublicUrl(currentUrl);
    const { data: introRow } = await supabase.from("intro_content").select("id").limit(1).maybeSingle();
    const { error: resumeSaveError } = introRow?.id ? await supabase.from("intro_content").update({ resume_url: url }).eq("id", introRow.id) : await supabase.from("intro_content").upsert({ ...defaultContent.intro, resume_url: url }, { onConflict: "id" });
    if (resumeSaveError) {
      return new Response(JSON.stringify({ error: resumeSaveError.message }), { status: 400 });
    }
    if (currentPath && currentPath.startsWith("resume/") && currentPath !== path) {
      await supabase.storage.from("portfolio-assets").remove([currentPath]);
    }
  }
  if (!isResumeUpload && (folder === "skills" || folder === "certificates")) {
    const currentPath = getStoragePathFromPublicUrl(currentUrl);
    if (currentPath && currentPath.startsWith(`${folder}/`) && currentPath !== path) {
      await supabase.storage.from("portfolio-assets").remove([currentPath]);
    }
  }
  return new Response(JSON.stringify({ url }), { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
