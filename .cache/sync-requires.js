const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---cache-dev-404-page-js": hot(preferDefault(require("/home/gqv/condisco_redux/.cache/dev-404-page.js"))),
  "component---src-pages-app-js": hot(preferDefault(require("/home/gqv/condisco_redux/src/pages/App.js"))),
  "component---src-pages-hello-js": hot(preferDefault(require("/home/gqv/condisco_redux/src/pages/hello.js"))),
  "component---src-pages-index-js": hot(preferDefault(require("/home/gqv/condisco_redux/src/pages/index.js"))),
  "component---src-pages-lesson-js": hot(preferDefault(require("/home/gqv/condisco_redux/src/pages/lesson.js"))),
  "component---src-pages-service-worker-js": hot(preferDefault(require("/home/gqv/condisco_redux/src/pages/serviceWorker.js")))
}

