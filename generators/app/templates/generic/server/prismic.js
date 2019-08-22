const Prismic = require('prismic-javascript')
const NodeCache = require('node-cache')
const { getLangFromPathHelper: getLang, log, logError } = require('./utils')

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
let prismicAPI
if (!process.env.CONTENT_API_URL || !process.env.CONTENT_API_TOKEN) {
  throw new Error(
    'Please provide CONTENT_API_TOKEN and CONTENT_API_URL variables from Prismic'
  )
}
// ---

// Define Cache and delay
let toResetCache = process.env.EXPORT ? true : false
const DELAY_API_CALLS = process.env.DELAY_API_CALLS
  ? process.env.DELAY_API_CALLS
  : 1000 * 60 * 60 * 2 // 2 hours
const cache = new NodeCache({
  stdTTL: DELAY_API_CALLS,
  checkperiod: 10000
})
// ---

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

const fixDocumentType = documentType => {
  let documentRTypeF = COMMON_DOCUMENTS_TYPE_MAP[documentType]
    ? COMMON_DOCUMENTS_TYPE_MAP[documentType]
    : documentType
  let urlSectionNeeded = false

  if (
    !COMMON_DOCUMENTS_TYPE_MAP[documentType] &&
    COMMON_DOCUMENTS.concat(COMMON_DOCUMENTS_FOR_PAGE_LISTED).indexOf(
      documentType
    ) < 0
  ) {
    // Example: /company/about-us
    documentRTypeF = 'page'
    urlSectionNeeded = true
  }

  return {
    urlSectionNeeded,
    documentRTypeF
  }
}

/**
 * GET DOCUMENT
 * First check if the document is in the local cache
 * If not in cache, it will fetch it from Prismic.io and save it in the cache afterwards
 */
const getDocument = (
  req, // @param req: any
  documentId, // @param documentId: string
  documentType, // @param documentType: string
  lang, // @param lang: string
  onSuccess, // @param onSuccess: (data: any) => void,
  onError // @param onError: (err: string, dataFallback?: any) => void
) => {
  const { documentRTypeF, urlSectionNeeded } = fixDocumentType(documentType)

  let documentIdF = documentId
  if (documentId && documentId === '*') {
    documentIdF = `all-${documentType}`
  }
  if (documentId.trim() === '') {
    documentIdF = 'home'
  }

  cache.get(`${documentIdF}-${lang}`, (err, value) => {
    const error = err || !value || value === undefined
    if (error || toResetCache) {
      // Cache key not found OR cache has been reset
      // So we're gonna fetch data from Prismic.io

      const onErrorQuery = e => {
        cache.set(`${documentIdF}-${lang}`, null)
        logError(`Prismic: ${documentIdF}: something went wrong: ${e}`)
        if (toResetCache) {
          onSuccess(value)
        } else {
          onError(e, value)
        }
      }

      const onErrorInit = error => {
        logError(
          `Prismic: ${documentIdF}: something went wrong when initializing the Prismic api: ${error}`
        )
        onError(error, value)
      }

      // If not init then we init the primisAPI
      try {
        prismicAPI = initApi(req)

        prismicAPI
          .then(api => {
            try {
              getSingleDocument(
                cache,
                api,
                documentId,
                documentIdF,
                documentType,
                documentRTypeF,
                lang,
                urlSectionNeeded,
                onSuccess,
                onErrorQuery,
                1
              )
            } catch (err) {
              onErrorInit(err)
            }
          })
          .catch(onErrorInit)
      } catch (err) {
        logError(
          `Prismic: something went wrong when initializing the Prismic api: ${err}`
        )
        onError(err, value)
      }
    } else {
      log(`Prismic: cache: document: ${documentIdF} : ${lang}`)
      onSuccess(value)
    }
  })
}

/**
 * GET SINGLE DOCUMENT
 * Fetch it from Prismic.io and save it in the cache afterwards
 * If pagination then call itself again
 */
const getSingleDocument = (
  cache, // @param cache: node-cache instance
  api, // @param api: Prismic API instance
  documentId, // @param documentId: string
  documentIdF,
  documentType, // @param documentType: string
  documentRTypeF,
  lang, // @param lang: string
  urlSectionNeeded, // @param urlSectionNeeded: boolean
  onSuccess, // @param onSuccess: (data: any) => void,
  onErrorQuery, // @param onError: (err: string, dataFallback?: any) => void,
  page = 1,
  previousPageResults = []
) => {
  const query =
    documentId !== '*' &&
    COMMON_REPEATABLE_DOCUMENTS.indexOf(documentRTypeF) >= 0 &&
    documentIdF !== documentRTypeF
      ? urlSectionNeeded
        ? [
            Prismic.Predicates.at(
              `my.${documentRTypeF}.uid`,
              `${documentId}-${lang}`
            ),
            Prismic.Predicates.at(
              `my.${documentRTypeF}.url_section`,
              documentType
            )
          ]
        : Prismic.Predicates.at(
            `my.${documentRTypeF}.uid`,
            `${documentId}-${lang}`
          )
      : Prismic.Predicates.at('document.type', documentRTypeF)

  api
    .query(query, {
      lang: LANGS_PRISMIC[lang],
      orderings: '[document.first_publication_date]',
      pageSize: 100,
      page
    })
    .then(res => {
      const { results = [], total_pages = 1, total_results_size } = res
      if (total_pages > page) {
        getSingleDocument(
          cache,
          api,
          documentId,
          documentIdF,
          documentType,
          documentRTypeF,
          lang,
          urlSectionNeeded,
          onSuccess,
          onErrorQuery,
          page + 1,
          previousPageResults.concat(results)
        )
        return
      }

      if (results.length >= 1 || previousPageResults.length > 0) {
        const resultsFix = previousPageResults.concat(results)
        let data
        if (documentId === '*') {
          data = {
            docType: documentRTypeF,
            results: resultsFix.map(item => ({
              ...item.data,
              uid: item.uid
            }))
          }
        } else {
          if (resultsFix.length > 1) {
            data = resultsFix.map(item => ({
              ...item.data,
              uid: item.uid,
              docType: documentRTypeF
            }))
          } else {
            data = resultsFix[0].data
            data.docType = documentRTypeF
            data.uid = resultsFix[0].uid
          }
        }
        cache.set(`${documentIdF}-${lang}`, data)
        onSuccess(data)
        log(`Prismic: document: ${documentIdF} : ${lang}`)
      } else {
        onErrorQuery(`Prismic: No results: ${documentIdF} : ${lang}`)
      }
    }, onErrorQuery)
    .catch(onErrorQuery)
}

/**
 * GET DOCUMENTS PAGE
 * First check if the Page content is in the local cache
 * If not in cache, it will fetch all content associated with a Page inside Prismic.io
 * Includes all the common elements needed in the page like 'navbar', 'footer' or 'page_404'
 */
const getDocumentsPage = (
  req, // @param req: any
  page, // @param page: string
  type, // @param type: string
  lang, // @param lang: string
  onSuccess, // @param onSuccess: (data: any) => void
  onError // onError: (err: string, dataFallback?: any) => void
) => {
  const fecthContent = (onSuccessFn, onErrorFn, cacheInstance) => {
    // Create the promise to get the page document
    const ePromises = []
    let COMMON_DOCUMENTS_FIX

    if (page) {
      ePromises.push(
        new Promise((resolve, reject) => {
          try {
            getDocument(req, page, type, lang, resolve, reject)
          } catch (e) {
            logError(`Error document: ${page} : ${type} : ${lang}`)
          }
        })
      )
    }

    // We add some common documents for some particular pages
    const { documentRTypeF } = fixDocumentType(type)
    COMMON_DOCUMENTS_FIX = COMMON_DOCUMENTS.concat(
      COMMON_DOCUMENTS_FOR_PAGE[documentRTypeF] || []
    ).concat(COMMON_DOCUMENTS_FOR_PAGE[page] || [])

    if (!page && !type) {
      COMMON_DOCUMENTS_FIX = COMMON_DOCUMENTS_FIX.concat(
        COMMON_DOCUMENTS_FOR_PAGE['all_pages']
      )
    }

    // Add the promises to get the all the common documents
    COMMON_DOCUMENTS_FIX.map(doc => {
      ePromises.push(
        new Promise((resolve, reject) => {
          try {
            getDocument(req, doc, doc, lang, resolve, reject)
          } catch (e) {
            logError(`Error document: ${doc} : ${lang}`)
          }
        })
      )
      return doc
    })

    // Run all the promises to get the needed content
    Promise.all(ePromises)
      .then(values => {
        // No results error
        if (!values || values.length <= 0 || !values[0]) {
          onErrorFn('Prismic: No results: All Promises')
          return
        }
        // We have results, lets order them
        try {
          const contentRes = page ? { ...values[0] } : {}

          // Map the results with their names
          COMMON_DOCUMENTS_FIX.map((doc, index) => {
            contentRes[doc] = values[index + (page ? 1 : 0)]
            return doc
          })

          log(
            `GET: ${
              page ? `${page.toUpperCase()} page content` : 'common content'
            } `
          )
          if (cacheInstance) {
            // Save into cache with the key
            cacheInstance.set(
              `content-result-${page || 'common'}-${lang}`,
              contentRes
            )
          }
          // Return result
          if (onSuccessFn) onSuccessFn(contentRes)
        } catch (e) {
          log('Error getting Content', e)
          // There was some error
          onErrorFn('Error getting Content: All Promises')
        }
      })
      .catch(onErrorFn)
  }

  if (process.env.EXPORT) {
    return new Promise((onSuccess, promiseReject) => {
      const onErrorFn = err => {
        const error = `Error getting content-result -> ${err}`
        console.log(error)
        promiseReject(null)
      }

      // So we're gonna fetch data from Prismic.io
      try {
        fecthContent(onSuccess, onErrorFn)
      } catch (e) {
        onErrorFn(e)
      }
    })
  } else {
    const onErrorFn = err => {
      const error = `Error getting cached content-result -> ${err}`
      console.log(error)
      if (onError) {
        const justCachedCommonDocs = {}
        if (COMMON_DOCUMENTS_FIX) {
          COMMON_DOCUMENTS_FIX.map((doc, index) => {
            justCachedCommonDocs[doc] = cache.get(`${doc}-${lang}`)
            return doc
          })
        }
        onError(
          error,
          cache.get(`content-result-${page}-${lang}`) || {
            error,
            ...justCachedCommonDocs
          }
        )
      }
    }

    cache.get(`content-result-${page}`, (err, value) => {
      const error = err || !value || value === undefined
      if (error || toResetCache) {
        // Cache key not found OR cache has been reset
        // So we're gonna fetch data from Prismic.io

        try {
          fecthContent(onSuccess, onErrorFn, cache)
        } catch (e) {
          onErrorFn(e)
        }
      } else {
        log('content from cache')
        if (onSuccess) onSuccess(value)
      }
    })
  }
}
const getAllForType = (req, docType, langCode, success, failure) => {
  try {
    prismicAPI = initApi(req)
    prismicAPI.then(api => {
      try {
        api
          .query(Prismic.Predicates.at('document.type', docType), {
            lang: langCode,
            pageSize: 100
          })
          .then(
            function(response) {
              success(response.results)
            },
            function(err) {
              console.log('Something went wrong: ', err)
            }
          )
      } catch (e) {
        log('getAllForType error: ', e)
      }
    })
  } catch (e) {
    log('prismicAPI initApi error: ', e)
  }
}

// Initialize the prismic.io api
const initApi = req => {
  let initApiParams = {
    accessToken: process.env.CONTENT_API_TOKEN
  }
  if (!!req && req.length > 1) {
    Object.assign(initApiParams, { req })
  }
  return Prismic.getApi(process.env.CONTENT_API_URL, initApiParams)
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

const refreshContent = (
  onSuccess, // @param onSuccess: (data: any) => void,
  onError // @param onError: (err: string, dataFallback?: any) => void
) => {
  // TODO: IF NEEDED - in here call getDocument with content needed to be cached
}

// Exports API
module.exports = {
  clearCache,
  getDocument,
  getDocumentsPage,
  getAllForType,
  init,
  refreshContent,
  LANGS_PRISMIC,
  COMMON_DOCUMENTS_TYPE_MAP,
  COMMON_DOCUMENTS_FOR_PAGE,
  COMMON_DOCUMENTS_FOR_PAGE_LISTED
}
