import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro } from './astro/server_y1XpGNYX.mjs';
import 'piccolore';
import { P as PortfolioApp } from './PortfolioApp_CiHLsqbj.mjs';
import { f as fetchPortfolioContent, $ as $$BaseLayout } from './BaseLayout_d7LB0cf-.mjs';

const $$Astro = createAstro();
const $$PortfolioPage = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PortfolioPage;
  const { title, view } = Astro2.props;
  const initialContent = await fetchPortfolioContent();
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `Murshida P. | ${title}` }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "PortfolioApp", PortfolioApp, { "client:load": true, "initialContent": initialContent, "initialView": view, "client:component-hydration": "load", "client:component-path": "@/components/portfolio/PortfolioApp", "client:component-export": "PortfolioApp" })} ` })}`;
}, "C:/Murshida/Career/murshida-portfolio/src/components/portfolio/PortfolioPage.astro", void 0);

export { $$PortfolioPage as $ };
