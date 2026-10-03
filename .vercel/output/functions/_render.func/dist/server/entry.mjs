import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_Bu-0xBzn.mjs';
import { manifest } from './manifest_BticiPDA.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/admin.astro.mjs');
const _page3 = () => import('./pages/api/admin/collection.astro.mjs');
const _page4 = () => import('./pages/api/admin/intro.astro.mjs');
const _page5 = () => import('./pages/api/admin/login.astro.mjs');
const _page6 = () => import('./pages/api/admin/logout.astro.mjs');
const _page7 = () => import('./pages/api/admin/upload.astro.mjs');
const _page8 = () => import('./pages/api/resume.astro.mjs');
const _page9 = () => import('./pages/certifications.astro.mjs');
const _page10 = () => import('./pages/experience.astro.mjs');
const _page11 = () => import('./pages/projects.astro.mjs');
const _page12 = () => import('./pages/skills.astro.mjs');
const _page13 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/admin/index.astro", _page2],
    ["src/pages/api/admin/collection.ts", _page3],
    ["src/pages/api/admin/intro.ts", _page4],
    ["src/pages/api/admin/login.ts", _page5],
    ["src/pages/api/admin/logout.ts", _page6],
    ["src/pages/api/admin/upload.ts", _page7],
    ["src/pages/api/resume.ts", _page8],
    ["src/pages/certifications.astro", _page9],
    ["src/pages/experience.astro", _page10],
    ["src/pages/projects.astro", _page11],
    ["src/pages/skills.astro", _page12],
    ["src/pages/index.astro", _page13]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "df8b4f2c-5891-45bb-9716-8b13c7f9ab23",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
