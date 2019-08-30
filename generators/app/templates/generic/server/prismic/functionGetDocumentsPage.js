const { log, logError } = require('./../utils')

const {
  COMMON_DOCUMENTS,
  COMMON_DOCUMENTS_FOR_PAGE,
  EXPORT
} = require('./constants')

const { fixDocumentType } = require('./functionsCommon')
const { getDocument } = require('./functionGetDocument')

/**
 * GET DOCUMENTS PAGE
 * First check if the Page content is in the local cache
 * If not in cache, it will fetch all content associated with a Page inside Prismic.io
 * Includes all the common elements needed in the page like 'navbar', 'footer' or 'page_404'
 */
const getDocumentsPage = (toResetCache, cache) => (
  req, // @param req: any
  page, // @param page: string
  type, // @param type: string
  lang, // @param lang: string
  onSuccess, // @param onSuccess: (data: any) => void
  onError // onError: (err: string, dataFallback?: any) => void
) => {
  let COMMON_DOCUMENTS_FIX

  const fecthContent = (onSuccessFn, onErrorFn, cacheInstance) => {
    // Create the promise to get the page document
    const ePromises = []

    if (page) {
      ePromises.push(
        new Promise((resolve, reject) => {
          try {
            getDocument(toResetCache, cache)(req, page, type, lang, resolve, reject)
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
            getDocument(toResetCache, cache)(req, doc, doc, lang, resolve, reject)
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

  if (EXPORT) {
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

module.exports = {
  getDocumentsPage
}