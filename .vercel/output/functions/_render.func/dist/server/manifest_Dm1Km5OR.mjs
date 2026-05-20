import 'piccolore';
import { o as decodeKey } from './chunks/astro/server_y1XpGNYX.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_CAmsnwlW.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Murshida/Career/murshida-portfolio/","cacheDir":"file:///C:/Murshida/Career/murshida-portfolio/node_modules/.astro/","outDir":"file:///C:/Murshida/Career/murshida-portfolio/dist/","srcDir":"file:///C:/Murshida/Career/murshida-portfolio/src/","publicDir":"file:///C:/Murshida/Career/murshida-portfolio/public/","buildClientDir":"file:///C:/Murshida/Career/murshida-portfolio/dist/client/","buildServerDir":"file:///C:/Murshida/Career/murshida-portfolio/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.B7uuLTjj.css"}],"routeData":{"route":"/admin","isIndex":true,"type":"page","pattern":"^\\/admin\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/index.astro","pathname":"/admin","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/admin/collection","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/collection\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"collection","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/collection.ts","pathname":"/api/admin/collection","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/admin/intro","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/intro\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"intro","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/intro.ts","pathname":"/api/admin/intro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/admin/login","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/login\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/login.ts","pathname":"/api/admin/login","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/admin/logout","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/logout\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"logout","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/logout.ts","pathname":"/api/admin/logout","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/admin/upload","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/upload\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"upload","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/upload.ts","pathname":"/api/admin/upload","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.B7uuLTjj.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Murshida/Career/murshida-portfolio/src/pages/admin/index.astro",{"propagation":"none","containsHead":true}],["C:/Murshida/Career/murshida-portfolio/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/admin/index@_@astro":"pages/admin.astro.mjs","\u0000@astro-page:src/pages/api/admin/collection@_@ts":"pages/api/admin/collection.astro.mjs","\u0000@astro-page:src/pages/api/admin/intro@_@ts":"pages/api/admin/intro.astro.mjs","\u0000@astro-page:src/pages/api/admin/login@_@ts":"pages/api/admin/login.astro.mjs","\u0000@astro-page:src/pages/api/admin/logout@_@ts":"pages/api/admin/logout.astro.mjs","\u0000@astro-page:src/pages/api/admin/upload@_@ts":"pages/api/admin/upload.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_Dm1Km5OR.mjs","C:/Murshida/Career/murshida-portfolio/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_HgG9MprX.mjs","@/components/admin/AdminApp":"_astro/AdminApp.md04pfLR.js","@/components/portfolio/PortfolioApp":"_astro/PortfolioApp.DjclvvDc.js","@astrojs/react/client.js":"_astro/client.CbHKJimV.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/manrope-vietnamese-400-normal.DHb3EETF.woff2","/_astro/manrope-cyrillic-400-normal.BMzJvInZ.woff2","/_astro/manrope-latin-400-normal.PaqtzbVb.woff2","/_astro/manrope-greek-400-normal.CM4qok81.woff2","/_astro/manrope-cyrillic-500-normal.B1OEZity.woff2","/_astro/manrope-latin-ext-400-normal.CMDvPJRp.woff2","/_astro/manrope-latin-ext-500-normal.dm74KBQw.woff2","/_astro/manrope-vietnamese-500-normal.DCXiE_xi.woff2","/_astro/manrope-greek-500-normal.GeMIHyWm.woff2","/_astro/manrope-latin-500-normal.BYYD-dBL.woff2","/_astro/manrope-vietnamese-700-normal.CUqMx5-1.woff2","/_astro/manrope-cyrillic-700-normal.Dw_fZAg2.woff2","/_astro/manrope-greek-700-normal.CHUG9PD8.woff2","/_astro/manrope-latin-ext-700-normal.DYOwVNan.woff2","/_astro/manrope-latin-700-normal.BZp_XxE4.woff2","/_astro/space-grotesk-vietnamese-700-normal.DMty7AZE.woff2","/_astro/space-grotesk-latin-ext-700-normal.BQnZhY3m.woff2","/_astro/space-grotesk-latin-700-normal.RjhwGPKo.woff2","/_astro/space-grotesk-latin-ext-400-normal.CfP_5XZW.woff2","/_astro/space-grotesk-latin-400-normal.CJ-V5oYT.woff2","/_astro/space-grotesk-vietnamese-400-normal.B7xT_GF5.woff2","/_astro/space-grotesk-vietnamese-500-normal.BmEvtly_.woff2","/_astro/space-grotesk-latin-ext-500-normal.DUe3BAxM.woff2","/_astro/space-grotesk-latin-500-normal.lFbtlQH6.woff2","/_astro/manrope-vietnamese-400-normal.D7E_mLGF.woff","/_astro/manrope-cyrillic-400-normal.Dvx59UGC.woff","/_astro/manrope-greek-400-normal.DuX9RsAR.woff","/_astro/manrope-latin-400-normal.8tf8FM3T.woff","/_astro/manrope-latin-ext-400-normal.C-X6QNXX.woff","/_astro/manrope-cyrillic-500-normal.CNwnNrRC.woff","/_astro/manrope-latin-ext-500-normal.EtoS1VaI.woff","/_astro/manrope-greek-500-normal.DyxYGEtJ.woff","/_astro/manrope-vietnamese-500-normal.DaZ8i3XM.woff","/_astro/manrope-latin-500-normal.DMZssgOp.woff","/_astro/manrope-vietnamese-700-normal.pt65Fn2Z.woff","/_astro/manrope-greek-700-normal.DyfsrCpP.woff","/_astro/manrope-latin-700-normal.DGRFkw-m.woff","/_astro/manrope-latin-ext-700-normal.eVCcYqtJ.woff","/_astro/manrope-cyrillic-700-normal.7JNVKxyl.woff","/_astro/space-grotesk-vietnamese-700-normal.Duxec5Rn.woff","/_astro/space-grotesk-latin-ext-700-normal.HVCqSBdx.woff","/_astro/space-grotesk-latin-700-normal.CwsQ-cCU.woff","/_astro/space-grotesk-latin-ext-400-normal.DRPE3kg4.woff","/_astro/space-grotesk-latin-400-normal.BnQMeOim.woff","/_astro/space-grotesk-vietnamese-400-normal.BIWiOVfw.woff","/_astro/space-grotesk-vietnamese-500-normal.BTqKIpxg.woff","/_astro/space-grotesk-latin-ext-500-normal.3dgZTiw9.woff","/_astro/space-grotesk-latin-500-normal.CNSSEhBt.woff","/_astro/index.B7uuLTjj.css","/favicon.ico","/favicon.svg","/profile-portrait.png","/fonts/Brigends Expanded.otf","/fonts/Crows Driven.otf","/fonts/Football Stage DEMO.otf","/fonts/Galantic-Regular.otf","/fonts/glacial-indifference.regular.otf","/fonts/GlacialIndifference-Regular.otf","/fonts/OpenSans-Bold.ttf","/fonts/OpenSans-BoldItalic.ttf","/fonts/OpenSans-ExtraBold.ttf","/fonts/OpenSans-ExtraBoldItalic.ttf","/fonts/OpenSans-Italic.ttf","/fonts/OpenSans-Light.ttf","/fonts/OpenSans-LightItalic.ttf","/fonts/OpenSans-Regular.ttf","/fonts/OpenSans-Semibold.ttf","/fonts/OpenSans-SemiboldItalic.ttf","/fonts/Rostex-Oblique.otf","/fonts/Rostex-Oblique.ttf","/fonts/Rostex-ObliqueOutline.otf","/fonts/Rostex-ObliqueOutline.ttf","/fonts/Rostex-Outline.otf","/fonts/Rostex-Outline.ttf","/fonts/Rostex-Regular.otf","/fonts/Rostex-Regular.ttf","/images/profile-picture.png","/_astro/AdminApp.md04pfLR.js","/_astro/card.Cb_ZDFnz.js","/_astro/client.CbHKJimV.js","/_astro/index.C5BVv2q5.js","/_astro/PortfolioApp.DjclvvDc.js"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"GSGoE2PqTro33Uk7SZzhfCGz8f42wFS43a+kbeNWaCE="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
