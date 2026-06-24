import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_y1XpGNYX.mjs';
import 'piccolore';
import { $ as $$PortfolioPage } from '../chunks/PortfolioPage_zz7eFHWv.mjs';
export { renderers } from '../renderers.mjs';

const $$Education = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "PortfolioPage", $$PortfolioPage, { "title": "Education", "view": "education" })}`;
}, "C:/Murshida/Career/murshida-portfolio/src/pages/education.astro", void 0);

const $$file = "C:/Murshida/Career/murshida-portfolio/src/pages/education.astro";
const $$url = "/education";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Education,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
