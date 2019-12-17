// When NOT on EXPORT we define the dynamic pages
if (!process.env.EXPORT) {
  const nextRoutes = require('next-routes')
  const routes = (module.exports = nextRoutes())

    // All routes
    routes.add('main', '/', 'main')
    routes.add('all', '/:lang(de|en)*/**/*', 'main')
} 

// When EXPORT we don't define dynamic pages
else {
  module.exports = {};
}