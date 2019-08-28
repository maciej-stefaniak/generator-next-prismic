// Libs import
const NodeCache = require('node-cache')

// Constants
const {
  COMMON_DOCUMENTS_FOR_PAGE_LISTED,
  COMMON_DOCUMENTS_FOR_PAGE,
  COMMON_DOCUMENTS_TYPE_MAP,
  LANGS_PRISMIC,
  DELAY_API_CALLS,
  EXPORT
} = require('./constants')

// Functions import
const { refreshContent, getAllForType } = require('./functionsCommon')
const { getDocument } = require('./functionGetDocument')
const { getDocumentsPage } = require('./functionGetDocumentsPage')

// Global variables
let toResetCache = EXPORT ? true : false
const cache = new NodeCache({
  stdTTL: DELAY_API_CALLS
    ? DELAY_API_CALLS
    : 1000 * 60 * 60 * 2,
  checkperiod: 10000
})

// Clear cache
const clearCache = () => {
  toResetCache = true
  console.log('Clearing cache and getting fresh content.')
  refreshContent(
    data => {
      toResetCache = false
    },
    (error, dataFallback) => {
      toResetCache = false
    }
  )
}

// Initialize our Prismic content api/cache
const init = () => {
  refreshContent(
    data => {
      toResetCache = false
    },
    (error, dataFallback) => {
      toResetCache = false
    }
  )
}

// Exports API
module.exports = {
  clearCache,
  getDocument: getDocument(toResetCache, cache),
  getDocumentsPage: getDocumentsPage(toResetCache, cache),
  getAllForType,
  init,
  refreshContent,
  LANGS_PRISMIC,
  COMMON_DOCUMENTS_TYPE_MAP,
  COMMON_DOCUMENTS_FOR_PAGE,
  COMMON_DOCUMENTS_FOR_PAGE_LISTED
}
