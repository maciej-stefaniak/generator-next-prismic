const COMMON_DOCUMENTS = ['navbar', 'footer' /*, cookie_message */]

// Define all the common repeatable documents that are only for some pages
// This way we only load for pages that needs it
const COMMON_DOCUMENTS_FOR_PAGE_LISTED = [
  /*'blog_detail'*/
]
const COMMON_DOCUMENTS_FOR_PAGE = {
  // blog_detail: ['blog_tag', 'blog_detail'],
  // blog: ['blog_tag', 'blog_detail'],
  all_pages: []
}
// ---

const COMMON_REPEATABLE_DOCUMENTS = ['page' /*, blog_detail */]
const COMMON_DOCUMENTS_TYPE_MAP = {
  page: 'page'
  //blog: 'blog_detail',
  //careers: 'jobs_detail'
}

// Here is the map to the proper language key in Prismic
// If using a different language from the ones below, add also here the Prismic lang version to its small one as a key
const LANGS_PRISMIC = {
  de: 'de-de',
  en: 'en-us',
  fr: 'fr-fr'
}

// Init env variables using dotenv if we don't have them in process context
if (!(process.env.CONTENT_API_URL && process.env.CONTENT_API_TOKEN)) {
  require('dotenv').config()
}

// Check if we have the proper data to connect to prismic
if (!process.env.CONTENT_API_URL || !process.env.CONTENT_API_TOKEN) {
  throw new Error(
    'Please provide CONTENT_API_TOKEN and CONTENT_API_URL variables from Prismic'
  )
}

module.exports = {
  COMMON_DOCUMENTS,
  COMMON_DOCUMENTS_FOR_PAGE_LISTED,
  COMMON_DOCUMENTS_FOR_PAGE,
  COMMON_REPEATABLE_DOCUMENTS,
  COMMON_DOCUMENTS_TYPE_MAP,
  LANGS_PRISMIC,
  CONTENT_API_URL: process.env.CONTENT_API_URL,
  CONTENT_API_TOKEN: process.env.CONTENT_API_TOKEN,
  DELAY_API_CALLS: process.env.DELAY_API_CALLS,
  EXPORT: process.env.EXPORT
}