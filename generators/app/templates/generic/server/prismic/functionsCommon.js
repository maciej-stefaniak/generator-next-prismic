const Prismic = require('prismic-javascript')
const { log } = require('./../utils')

const {
  ALL_COMMON_DOCUMENTS,
  LANGS_PRISMIC,
  PRISMIC_PER_PAGE,
  CONTENT_API_URL,
  CONTENT_API_TOKEN,
  EXPORT
} = require('./constants')

const getAllForType = (
  req,
  docType,
  langCode,
  success,
  failure,
  page = 1,
  previousPageResults = []
) => {
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
            function(response) {
              const { results = [], total_pages = 1 } = response
              const resultData = previousPageResults.concat(results)
              if (total_pages > page) {
                getAllForType(
                  req,
                  docType,
                  langCode,
                  success,
                  failure,
                  page + 1,
                  resultData
                )
              } else {
                success(resultData)
              }
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

const getPathAndProps = path => {
  const hasSpecificProps = path.indexOf('[') > 0
  const pathParts = hasSpecificProps ? path.split('[') : [path, null]
  return {
    pathNoProps: pathParts[0],
    pathProps: hasSpecificProps
      ? JSON.parse(`[${pathParts[1].replace(']', '')}]`)
      : null
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
  path, // @param path: string
  lang, // @param lang: string
  onSuccess, // @param onSuccess: (data: any) => void,
  onErrorQuery, // @param onError: (err: string, dataFallback?: any) => void,
  page = 1,
  previousPageResults = [],
  EXPORT_SIMULATED_CACHE = {}
) => {
  let query,
    pathProps,
    pathNoProps = path
  if (path && path !== '*' && ALL_COMMON_DOCUMENTS.indexOf(path) < 0) {
    query = Prismic.Predicates.any('document.tags', [path])
  } else {
    const pathfix = getPathAndProps(path)
    pathNoProps = pathfix.pathNoProps
    pathProps = pathfix.pathProps
    /*if (pathProps) {
      console.log('Page with pathProps', pathProps)
    }*/
    query = Prismic.Predicates.at('document.type', pathNoProps)
  }

  api
    .query(query, {
      lang: LANGS_PRISMIC[lang],
      orderings: '[document.first_publication_date]',
      pageSize: PRISMIC_PER_PAGE,
      page
    })
    .then(res => {
      const { results = [], total_pages = 1, total_results_size } = res
      if (total_pages > page) {
        getSingleDocument(
          cache,
          api,
          path,
          lang,
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
        if (path === '*') {
          data = {
            docType: path,
            results: resultsFix.map(item => {
              return {
                ...item.data,
                uid: item.uid,
                tags: item.tags,
                docType: item.type
              }
            })
          }
        } else {
          if (resultsFix.length > 1) {
            data = resultsFix.map(item => {
              let resultData = {}
              if (pathProps) {
                pathProps.map(prop => {
                  resultData[prop] = item.data[prop]
                })
              } else {
                resultData = { ...item.data }
              }
              return {
                ...resultData,
                uid: item.uid,
                tags: item.tags,
                docType: item.type
              }
            })
          } else {
            let resultData = {}
            if (pathProps) {
              pathProps.map(prop => {
                resultData[prop] = resultsFix[0].data[prop]
              })
            } else {
              resultData = { ...resultsFix[0].data }
            }
            data = resultData
            data.docType = resultsFix[0].type
            data.uid = resultsFix[0].uid
            data.tags = resultsFix[0].tags
          }
        }
        cache.set(`${path}-${lang}`, data)
        if (EXPORT) EXPORT_SIMULATED_CACHE[`${path}-${lang}`] = data
        onSuccess(data)
        log(`Prismic: document: ${path} : ${lang}`)
      } else {
        onErrorQuery(`Prismic: No results: ${path} : ${lang}`)
      }
    }, onErrorQuery)
    .catch(onErrorQuery)
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
  refreshContent,
  getAllForType,
  getSingleDocument,
  initApi
}
