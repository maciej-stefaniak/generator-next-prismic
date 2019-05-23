// When NOT on EXPORT we define the dynamic pages
if (!process.env.EXPORT) {
  const nextRoutes = require('next-routes')
  const routes = (module.exports = nextRoutes())

  // Home
  routes.add('home', '/:lang(<%= languages ? languages.join('|') : 'de' %>)*', 'main')

  // Other pages

  // Example Detail page
  // routes.add('example', '/:lang(<%= languages ? languages.join('|') : 'de' %>)*/example', 'main')
  // routes.add('example-detail', '/:lang(<%= languages ? languages.join('|') : 'de' %>)*/example/:job_id', 'example_detail')
} 

// When EXPORT we don't define dynamic pages
else {
  module.exports = {};
}