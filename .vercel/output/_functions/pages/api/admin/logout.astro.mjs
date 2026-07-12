import { i as isSameOriginAdminRequest, f as forbiddenResponse, A as ADMIN_ACCESS_COOKIE, c as ADMIN_REFRESH_COOKIE } from '../../../chunks/auth_B79Sfj4C.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies }) => {
  if (!isSameOriginAdminRequest(request)) {
    return forbiddenResponse();
  }
  cookies.delete(ADMIN_ACCESS_COOKIE, { path: "/" });
  cookies.delete(ADMIN_REFRESH_COOKIE, { path: "/" });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
