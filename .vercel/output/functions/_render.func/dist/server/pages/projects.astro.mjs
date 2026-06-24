import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_y1XpGNYX.mjs';
import 'piccolore';
import { $ as $$PortfolioPage } from '../chunks/PortfolioPage_zz7eFHWv.mjs';
export { renderers } from '../renderers.mjs';

const $$Projects = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "PortfolioPage", $$PortfolioPage, { "title": "Projects", "view": "projects" })}`;
}, "C:/Murshida/Career/murshida-portfolio/src/pages/projects.astro", void 0);

const $$file = "C:/Murshida/Career/murshida-portfolio/src/pages/projects.astro";
const $$url = "/projects";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Projects,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
