import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_4Yw_W1_G.mjs';
import 'piccolore';
import { $ as $$PortfolioPage } from '../chunks/PortfolioPage_9CSGwGzb.mjs';
export { renderers } from '../renderers.mjs';

const $$Skills = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "PortfolioPage", $$PortfolioPage, { "title": "Skills", "view": "skills" })}`;
}, "C:/Murshida/Career/portfolio/src/pages/skills.astro", void 0);

const $$file = "C:/Murshida/Career/portfolio/src/pages/skills.astro";
const $$url = "/skills";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Skills,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
