import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DFX2nYEL.mjs';
import { manifest } from './manifest_Dm1Km5OR.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin.astro.mjs');
const _page2 = () => import('./pages/api/admin/collection.astro.mjs');
const _page3 = () => import('./pages/api/admin/intro.astro.mjs');
const _page4 = () => import('./pages/api/admin/login.astro.mjs');
const _page5 = () => import('./pages/api/admin/logout.astro.mjs');
const _page6 = () => import('./pages/api/admin/upload.astro.mjs');
const _page7 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/admin/index.astro", _page1],
    ["src/pages/api/admin/collection.ts", _page2],
    ["src/pages/api/admin/intro.ts", _page3],
    ["src/pages/api/admin/login.ts", _page4],
    ["src/pages/api/admin/logout.ts", _page5],
    ["src/pages/api/admin/upload.ts", _page6],
    ["src/pages/index.astro", _page7]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "46c2edd9-6488-48d9-9999-d8a970ce31c0",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
