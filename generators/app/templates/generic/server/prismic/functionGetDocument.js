const { log, logError } = require('./../utils')
const { COMMON_DOCUMENTS } = require('./constants')

const {
  fixDocumentType,
  getSingleDocument,
  initApi
} = require('./functionsCommon')

/**
 * GET DOCUMENT
 * First check if the document is in the local cache
 * If not in cache, it will fetch it from Prismic.io and save it in the cache afterwards
 */
const getDocument = (toResetCache, cache) => (
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

        if (COMMON_DOCUMENTS.includes(documentIdF)) {
          onError(new Error(`Common document ${documentIdF} not found`))
        }

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
        let prismicAPI = initApi(req)

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

module.exports = {
  getDocument
}