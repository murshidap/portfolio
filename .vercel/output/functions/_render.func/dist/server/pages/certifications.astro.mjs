import { e as createComponent, m as maybeRenderHead, g as addAttribute, r as renderTemplate, h as createAstro, k as renderComponent } from '../chunks/astro/server_tE5jNKah.mjs';
import 'piccolore';
import 'clsx';
import { $ as $$PortfolioShell } from '../chunks/PortfolioShell_CQL5CkHf.mjs';
import { f as fetchPortfolioContent } from '../chunks/content_DBw6s_dR.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$CertificatesPage = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CertificatesPage;
  const { items } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="mx-auto flex min-h-[72vh] w-full max-w-[1180px] flex-col justify-start py-10"> <div class="grid grid-cols-1 gap-5 md:grid-cols-2"> ${items.map((item, index) => {
    const href = item.asset_url || "#";
    return renderTemplate`<a${addAttribute(!item.asset_url, "aria-disabled")}${addAttribute([
      "group flex h-16 w-full items-center overflow-hidden rounded-md border border-zinc-950 bg-white px-6 text-zinc-950 shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition hover:bg-white hover:shadow-[0_16px_42px_rgba(0,0,0,0.1)]",
      !item.asset_url && "pointer-events-none opacity-60"
    ], "class:list")}${addAttribute(href, "href")} rel="noreferrer"${addAttribute(item.asset_url ? "_blank" : void 0, "target")}> <span class="mr-5 w-10 shrink-0 text-sm font-semibold tabular-nums text-zinc-950 md:text-base">${index + 1}</span> <span class="min-w-0 flex-1"> <span class="block truncate text-sm font-semibold uppercase leading-tight tracking-normal md:text-base">${item.title}</span> <span class="mt-1 block truncate text-xs font-medium uppercase leading-tight tracking-[0.16em] text-zinc-600">${item.issuer}</span> </span> </a>`;
  })} </div> </section>`;
}, "C:/Murshida/Career/portfolio/src/components/portfolio/CertificatesPage.astro", void 0);

const $$Certifications = createComponent(async ($$result, $$props, $$slots) => {
  const initialContent = await fetchPortfolioContent();
  return renderTemplate`${renderComponent($$result, "PortfolioShell", $$PortfolioShell, { "activeView": "certificates", "intro": initialContent.intro, "title": "Certifications" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="relative z-0 flex min-h-0 flex-1 overflow-hidden"> ${renderComponent($$result2, "CertificatesPage", $$CertificatesPage, { "items": initialContent.certificates })} </div> ` })}`;
}, "C:/Murshida/Career/portfolio/src/pages/certifications.astro", void 0);

const $$file = "C:/Murshida/Career/portfolio/src/pages/certifications.astro";
const $$url = "/certifications";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Certifications,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
