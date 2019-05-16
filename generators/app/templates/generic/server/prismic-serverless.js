const Prismic = require('prismic-javascript')

const { getLangFromPathHelper: getLang, log, logError } = require('./utils')

const COMMON_DOCUMENTS = ['navbar', 'footer', 'page_404']
const COMMON_REPEATABLE_DOCUMENTS = ['page', 'news_detail']
const COMMON_DOCUMENTS_TYPE_MAP = {}

// Here is the map to the proper language key in Prismic
// If using a different language from the ones below, add also here the Prismic lang version to its small one as a key
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

/**
 * GET DOCUMENT
 * It will fetch it from Prismic.io and save it in the cache afterwards
 */
const getDocument = (
  req,
  documentId,
  documentType,
  lang,
  onSuccess,
  onError
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

  // Fetch data from Prismic.io
  const onErrorQuery = e => {
    logError(`Prismic: ${documentIdF}: something went wrong: ${e}`)

    onError(e, null)
  }

  const onErrorInit = error => {
    logError(
      `Prismic: ${documentIdF}: something went wrong when initializing the Prismic api: ${error}`
    )
    onError(error, null)
  }

  // If not init then we init the primisAPI
  try {
    prismicAPI = initApi()

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
                onSuccess(data)
                log(`Prismic: document: ${documentIdF} : ${lang}`)
              } else {
                // onErrorQuery(
                //   `Prismic: No results: ${documentIdF} : ${lang}`
                // )
              }
            }, onErrorQuery)
            .catch(onErrorQuery)
        } catch (err) {
          onErrorInit(err)
        }
      })
      .catch(onErrorInit)
  } catch (err) {
    logError(
      `Prismic: something went wrong when initializing the Prismic api: ${err}`
    )
    onError(err, null)
  }

}

/**
 * GET DOCUMENTS PAGE
 * It will fetch all content associated with a Page inside Prismic.io
 * Includes all the common elements needed in the page like 'navbar', 'footer' or 'page_404'
 */
const getDocumentsPage = (
  req,
  page,
  type,
  lang
) => {

  return new Promise((onSuccess, promiseReject) => {

    const onErrorFn = err => {
      const error = `Error getting cached content-result -> ${err}`
      console.log(error)
      promiseReject(null)
    }

    // So we're gonna fetch data from Prismic.io

    // Create the promise to get the page document
    const ePromises = []
    ePromises.push(
      new Promise((resolve, reject) => {
        try {
          getDocument(req, page, type, lang, resolve, reject)
        } catch (e) {
          logError(`Error document: ${page} : ${type} : ${lang}`)
        }
      })
    )

    // Add the promises to get the all the common documents
    COMMON_DOCUMENTS.map(doc => {
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
        if (!values || values.length <= 0) {
          onErrorFn('Prismic: No results: All Promises')
          return
        }
        // We have results, lets order them
        try {
          const contentRes = { ...values[0] }
          // Map the results with their names
          COMMON_DOCUMENTS.map((doc, index) => {
            contentRes[doc] = values[index + 1]
            return doc
          })
          log(`GET: ${page.toUpperCase()} page content`)
          // Return result
          if (onSuccess) onSuccess(contentRes)
        } catch (e) {
          log('Error getting Content', e)
          // There was some error
          onErrorFn('Error getting Content: All Promises')
        }
      })
      .catch(onErrorFn)
  })
}

const getAllForType = (
  docType,
  langCode,
  success,
  failure
) => {
  try {
    prismicAPI = initApi()
    prismicAPI.then(api => {
      try {
        api.query(
          Prismic.Predicates.at('document.type', docType),
          { 
            lang: langCode,
            pageSize: 100
          }
        ).then(function (response) {
          success(response.results)
        }, function(err) {
          console.log("Something went wrong: ", err);
        });
      }
      catch (e) {
        log('getAllForType error: ', e)
      }
    });

  }
  catch (e) {
    log('prismicAPI initApi error: ', e)
  }
}

// Initialize the prismic.io api
const initApi = () =>
  Prismic.getApi(process.env.CONTENT_API_URL, {
    accessToken: process.env.CONTENT_API_TOKEN
  })

// Initialize our Prismic content api/cache
const init = () => {
  refreshContent(
    data => {
    },
    (error, dataFallback) => {
    }
  )
}

const refreshContent = (
  onSuccess,
  onError
) => {
  // TODO: IF NEEDED - in here call getDocument with content needed to be cached
}

// Exports API
module.exports = {
  getDocument,
  getDocumentsPage,
  init,
  getAllForType,
  refreshContent
}
