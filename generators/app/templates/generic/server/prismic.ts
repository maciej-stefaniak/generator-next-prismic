const Prismic = require('prismic-javascript')
const NodeCache = require('node-cache')
const { getLangFromPathHelper: getLang } = require('./utils')

const COMMON_DOCUMENTS = ['navbar', 'footer', 'page_404']
const COMMON_REPEATABLE_DOCUMENTS = ['page']
const COMMON_DOCUMENTS_TYPE_MAP = {}

const LANGS_PRISMIC = {
  de: 'de-de',
  en: 'en-us'
}

let prismicAPI
if (!process.env.CONTENT_API_URL || !process.env.CONTENT_API_TOKEN) {
  throw new Error(
    'Please provide CONTENT_API_TOKEN and CONTENT_API_URL variables from Prismic'
  )
}
// ---

// Define Cache and delay
let toResetCache = false
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

// Get document from Prismic.io
const getDocument = (
  req: any,
  documentId: string,
  documentType: string,
  lang: string,
  onSuccess: (data: any) => void,
  onError: (err: string, dataFallback?: any) => void
) => {
  const documentRTypeF = COMMON_DOCUMENTS_TYPE_MAP[documentType]
    ? COMMON_DOCUMENTS_TYPE_MAP[documentType]
    : documentType

  let documentIdF = documentId
  if (documentId === '*') {
    documentIdF = `all-${documentType}`
  }
  if (documentId.trim() === '') {
    documentIdF = 'home'
  }

  /*
    if (!lang && req) {
      lang = getLang(req.url, req)
    }
  */

  cache.get(`${documentIdF}-${lang}`, (err, value) => {
    const error = err || !value || value === undefined
    if (error || toResetCache) {
      // Key not found
      // So we fetch data from Prismic

      const onErrorQuery = err => {
        cache.set(`${documentIdF}-${lang}`, null)
        console.log(`Prismic: something went wrong: ${err}`)
        if (toResetCache) {
          onSuccess(value)
        } else {
          onError(err, value)
        }
      }

      const onErrorInit = error => {
        console.log(
          `Prismic: something went wrong when initializing the Prismic api: ${error}`
        )
        onError(error, value)
      }

      // If not init then we init the primisAPI
      try {
        if (!prismicAPI || toResetCache) {
          prismicAPI = initApi(req)
        }

        prismicAPI
          .then(api => {
            try {
              api
                .query(
                  documentId !== '*' &&
                    COMMON_REPEATABLE_DOCUMENTS.indexOf(documentRTypeF) >= 0
                    ? Prismic.Predicates.at(
                        `my.${documentRTypeF}.uid`,
                        `${documentId}-${lang}`
                      )
                    : Prismic.Predicates.at('document.type', documentRTypeF),
                  { lang: LANGS_PRISMIC[lang] }
                )
                .then(res => {
                  const { results } = res
                  if (results && results.length >= 1) {
                    let data
                    if (documentId === '*') {
                      data = {
                        docType: documentRTypeF,
                        results: results.map(item => ({
                          ...item.data,
                          uid: item.uid
                        }))
                      }
                    } else {
                      data = results[0].data
                      data.docType = documentRTypeF
                    }
                    cache.set(`${documentIdF}-${lang}`, data)
                    onSuccess(data)
                    console.log(`Prismic: document: ${documentIdF} : ${lang}`)
                  } else {
                    onErrorQuery(
                      `Prismic: No results: ${documentIdF} : ${lang}`
                    )
                  }
                }, onErrorQuery)
                .catch(onErrorQuery)
            } catch (err) {
              onErrorInit(err)
            }
          })
          .catch(onErrorInit)
      } catch (err) {
        console.log(
          `Prismic: something went wrong when initializing the Prismic api: ${err}`
        )
        onError(err, value)
      }
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Prismic: cache: document: ${documentIdF} : ${lang}`)
      }
      onSuccess(value)
    }
  })
}

const getDocumentsPage = (
  req: any,
  page: string,
  type: string,
  lang: string,
  onSuccess: (data: any) => void,
  onError: (err: string, dataFallback?: any) => void
) => {
  const onErrorFn = err => {
    const error = `Error getting cached content-result -> ${err}`
    console.log(error)
    if (onError) {
      const justCachedCommonDocs = {}
      COMMON_DOCUMENTS.map((doc, index) => {
        justCachedCommonDocs[doc] = cache.get(`${doc}-${lang}`)
        return doc
      })
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
      // Get Content for page
      const ePromises = []
      ePromises.push(
        new Promise((resolve, reject) => {
          try {
            getDocument(req, page, type, lang, resolve, reject)
          } catch (e) {
            console.log(`Error document: ${page} : ${type} : ${lang}`)
          }
        })
      )
      COMMON_DOCUMENTS.map(doc => {
        ePromises.push(
          new Promise((resolve, reject) => {
            try {
              getDocument(req, doc, doc, lang, resolve, reject)
            } catch (e) {
              console.log(`Error document: ${doc} : ${lang}`)
            }
          })
        )
        return doc
      })

      Promise.all(ePromises)
        .then(values => {
          if (!values || values.length <= 0) {
            onErrorFn('Prismic: No results: All Promises')
            return
          }
          try {
            const contentRes = {
              ...values[0]
            }
            COMMON_DOCUMENTS.map((doc, index) => {
              contentRes[doc] = values[index + 1]
              return doc
            })
            console.log(`GET: ${page.toUpperCase()} page content`)
            cache.set(`content-result-${page}-${lang}`, contentRes)
            if (onSuccess) onSuccess(contentRes)
          } catch (e) {
            console.log('Error getting Content', e)
            onErrorFn('Error getting Content: All Promises')
          }
        })
        .catch(onErrorFn)
    } else {
      console.log('content from cache')
      if (onSuccess) onSuccess(value)
    }
  })
}

// Initialize the prismic.io api
const initApi = req =>
  Prismic.getApi(process.env.CONTENT_API_URL, {
    accessToken: process.env.CONTENT_API_TOKEN,
    req
  })

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
  onSuccess: (data: any) => void,
  onError: (err: string, dataFallback?: any) => void
) => {
  // TODO: IF NEEDED - in here call getDocument with content needed to be cached
}

// Exports API
module.exports = {
  clearCache,
  getDocument,
  getDocumentsPage,
  init,
  refreshContent
}
