import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_y1XpGNYX.mjs';
import 'piccolore';
import { P as PortfolioApp } from '../chunks/PortfolioApp_CiHLsqbj.mjs';
import { f as fetchPortfolioContent, $ as $$BaseLayout } from '../chunks/BaseLayout_d7LB0cf-.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const initialContent = await fetchPortfolioContent();
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Murshida P. | Web Developer" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "PortfolioApp", PortfolioApp, { "client:load": true, "initialContent": initialContent, "initialView": "home", "client:component-hydration": "load", "client:component-path": "@/components/portfolio/PortfolioApp", "client:component-export": "PortfolioApp" })} ` })}`;
}, "C:/Murshida/Career/murshida-portfolio/src/pages/index.astro", void 0);

const $$file = "C:/Murshida/Career/murshida-portfolio/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
