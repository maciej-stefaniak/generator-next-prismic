const Prismic = require('prismic-javascript')
const { log } = require('./../utils')

const {
  COMMON_DOCUMENTS,
  COMMON_DOCUMENTS_FOR_PAGE_LISTED,
  COMMON_REPEATABLE_DOCUMENTS,
  COMMON_DOCUMENTS_TYPE_MAP,
  LANGS_PRISMIC,
  PRISMIC_PER_PAGE,
  CONTENT_API_URL,
  CONTENT_API_TOKEN
} = require('./constants')

const getAllForType = (req, docType, langCode, success, failure, page = 1, previousPageResults = []) => {
  try {
    let prismicAPI = initApi(req)
    prismicAPI.then(api => {
      try {
        api
          .query(Prismic.Predicates.at('document.type', docType), {
            lang: langCode,
            pageSize: PRISMIC_PER_PAGE,
            page: page
          })
          .then(
            function (response) {
              const { results = [], total_pages = 1 } = response
              const resultData = previousPageResults.concat(results)
              if (total_pages > page) {
                getAllForType(req, docType, langCode, success, failure, page + 1, resultData)
              }
              else {
                success(resultData)
              }
            },
            function (err) {
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

const refreshContent = (
  onSuccess, // @param onSuccess: (data: any) => void,
  onError // @param onError: (err: string, dataFallback?: any) => void
) => {
  // TODO: IF NEEDED - in here call getDocument with content needed to be cached
}

// Initialize the prismic.io api
const initApi = req => {
  let initApiParams = {
    accessToken: CONTENT_API_TOKEN
  }
  if (!!req && req.length > 1) {
    Object.assign(initApiParams, { req })
  }
  return Prismic.getApi(CONTENT_API_URL, initApiParams)
}

module.exports = {
  fixDocumentType,
  refreshContent,
  getAllForType,
  getSingleDocument,
  initApi
}