import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_y1XpGNYX.mjs';
import 'piccolore';
import { $ as $$PortfolioPage } from '../chunks/PortfolioPage_zz7eFHWv.mjs';
export { renderers } from '../renderers.mjs';

const $$Certifications = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "PortfolioPage", $$PortfolioPage, { "title": "Certifications", "view": "certificates" })}`;
}, "C:/Murshida/Career/murshida-portfolio/src/pages/certifications.astro", void 0);

const $$file = "C:/Murshida/Career/murshida-portfolio/src/pages/certifications.astro";
const $$url = "/certifications";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Certifications,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
