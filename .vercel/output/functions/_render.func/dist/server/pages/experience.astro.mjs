import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_y1XpGNYX.mjs';
import 'piccolore';
import { $ as $$PortfolioPage } from '../chunks/PortfolioPage_zz7eFHWv.mjs';
export { renderers } from '../renderers.mjs';

const $$Experience = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "PortfolioPage", $$PortfolioPage, { "title": "Experience", "view": "experience" })}`;
}, "C:/Murshida/Career/murshida-portfolio/src/pages/experience.astro", void 0);

const $$file = "C:/Murshida/Career/murshida-portfolio/src/pages/experience.astro";
const $$url = "/experience";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Experience,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
