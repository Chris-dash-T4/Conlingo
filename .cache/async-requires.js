// prefer default export if available
const preferDefault = m => (m && m.default) || m

exports.components = {
  "component---cache-dev-404-page-js": () => import("./../../dev-404-page.js" /* webpackChunkName: "component---cache-dev-404-page-js" */),
  "component---src-pages-app-js": () => import("./../../../src/pages/App.js" /* webpackChunkName: "component---src-pages-app-js" */),
  "component---src-pages-hello-js": () => import("./../../../src/pages/hello.js" /* webpackChunkName: "component---src-pages-hello-js" */),
  "component---src-pages-index-js": () => import("./../../../src/pages/index.js" /* webpackChunkName: "component---src-pages-index-js" */),
  "component---src-pages-lesson-js": () => import("./../../../src/pages/lesson.js" /* webpackChunkName: "component---src-pages-lesson-js" */),
  "component---src-pages-service-worker-js": () => import("./../../../src/pages/serviceWorker.js" /* webpackChunkName: "component---src-pages-service-worker-js" */)
}

