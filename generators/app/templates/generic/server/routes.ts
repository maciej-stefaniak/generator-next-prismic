const nextRoutes = require('next-routes')

const routes = (module.exports = nextRoutes())

// Home
routes.add('home', '/:lang(<%= languages ? languages.join('|') : 'de' %>)*', 'main')

// Other pages
