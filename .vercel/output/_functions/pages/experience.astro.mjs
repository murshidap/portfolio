import { e as createComponent, m as maybeRenderHead, r as renderTemplate, h as createAstro, k as renderComponent } from '../chunks/astro/server_tE5jNKah.mjs';
import 'piccolore';
import 'clsx';
import { $ as $$PortfolioShell } from '../chunks/PortfolioShell_s9hWfDyt.mjs';
import { f as fetchPortfolioContent } from '../chunks/content_Cl0kQkyE.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$ExperiencePage = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ExperiencePage;
  const { items } = Astro2.props;
  return renderTemplate`${items.length === 0 ? renderTemplate`${maybeRenderHead()}<section class="mx-auto flex min-h-[72vh] w-full max-w-[1120px] flex-col justify-center py-10"><p class="text-sm text-zinc-600">No experience entries yet.</p></section>` : renderTemplate`<section class="flex min-h-full w-full items-center overflow-x-auto overflow-y-hidden py-10"><div class="flex w-max items-center gap-6 px-[max(1rem,calc((100vw-1180px)/2))] md:gap-8">${items.map((item) => renderTemplate`<article class="flex h-[clamp(21rem,34vw,28rem)] w-[clamp(17rem,28vw,23rem)] shrink-0 flex-col justify-between overflow-hidden rounded-[1.5rem] border border-white/12 bg-black/[0.78] p-7 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur-3xl md:p-8"><div><h3 class="text-[clamp(1rem,1.8vw,1.65rem)] font-semibold uppercase leading-tight tracking-normal text-white">${item.role}</h3><p class="mt-4 text-[clamp(0.8rem,1.25vw,1.05rem)] font-semibold uppercase leading-tight text-zinc-100">${item.company}</p><p class="mt-1 text-[clamp(0.75rem,1.1vw,0.95rem)] font-medium uppercase leading-tight text-zinc-300">${item.duration}</p></div><p class="max-h-[7.5rem] overflow-hidden text-sm leading-6 text-zinc-300">${item.description}</p></article>`)}</div></section>`}`;
}, "C:/Murshida/Career/portfolio/src/components/portfolio/ExperiencePage.astro", void 0);

const $$Experience = createComponent(async ($$result, $$props, $$slots) => {
  const initialContent = await fetchPortfolioContent();
  return renderTemplate`${renderComponent($$result, "PortfolioShell", $$PortfolioShell, { "activeView": "experience", "intro": initialContent.intro, "title": "Experience" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="relative z-0 flex min-h-0 flex-1 overflow-hidden"> ${renderComponent($$result2, "ExperiencePage", $$ExperiencePage, { "items": initialContent.experience })} </div> ` })}`;
}, "C:/Murshida/Career/portfolio/src/pages/experience.astro", void 0);

const $$file = "C:/Murshida/Career/portfolio/src/pages/experience.astro";
const $$url = "/experience";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Experience,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
