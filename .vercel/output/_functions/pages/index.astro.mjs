import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_4Yw_W1_G.mjs';
import 'piccolore';
import { P as PortfolioApp } from '../chunks/PortfolioApp_D85OaiJ4.mjs';
import { f as fetchPortfolioContent, $ as $$BaseLayout } from '../chunks/BaseLayout__YDfVSjE.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const initialContent = await fetchPortfolioContent();
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Murshida P. | Web Developer" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "PortfolioApp", PortfolioApp, { "client:load": true, "initialContent": initialContent, "initialView": "home", "client:component-hydration": "load", "client:component-path": "@/components/portfolio/PortfolioApp", "client:component-export": "PortfolioApp" })} ` })}`;
}, "C:/Murshida/Career/portfolio/src/pages/index.astro", void 0);

const $$file = "C:/Murshida/Career/portfolio/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
