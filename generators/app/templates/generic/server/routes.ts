const nextRoutes = require('next-routes')

const routes = (module.exports = nextRoutes())

// Home
routes.add('home', '/:lang(<%= languages ? languages.join('|') : 'de' %>)*', 'main')

// Other pages

// Example Detail page
// routes.add('example', '/:lang(<%= languages ? languages.join('|') : 'de' %>)*/example', 'main')
// routes.add('example-detail', '/:lang(<%= languages ? languages.join('|') : 'de' %>)*/example/:job_id', 'example_detail')
