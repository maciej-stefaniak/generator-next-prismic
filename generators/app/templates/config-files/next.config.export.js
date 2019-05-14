const prismicApi = require('./server/prismic-serverless')

/**
 * Routing configuration for export
 * Key: Prismic's type
 * Value: {
 *  routePrefix: prefix to be appended before Prismic's object ID
 *  pagePath: name of file in /pages folder
 *  queryData: name of variable to be passed to container with value of Prismic's object ID
 * }
 * 
 * Example config object:
 * {
 *  page: {
 *   routePrefix: '/',
 *   pagePath: '/main'
 *  },
 *  news_detail: {
 *   routePrefix: '/news/',
 *   pagePath: '/news_detail',
 *   queryData: 'news_id'
 *  }
 * }
 */
const TYPE_ROUTES_MAPPING = {
  page: {
    routePrefix: '/',
    pagePath: '/main'
  }
}

/**
 * App-to-Prismic languges mapping.
 * Key: app's language code
 * Value: Prismic's language code
 * 
 * Example object: 
 * 
 * {
 *  de: 'de-de',
 *  en: 'en-en'
 * }
 */
const LANGS_PRISMIC = {
  de: 'de-de',
  en: 'en-en'
}

/**
 * Helper function for searching for a key for a given value  
 */
const getKeyByValue = (object, value) => {
  return Object.keys(object).find(key => object[key] === value);
}

/**
 * Module's main function which produces path mapping object for next.js 
 * export as described at https://github.com/zeit/next.js/#usage
 * 
 * Example result object:
 * 
 * {
 *   '/de/page': { page: '/main' },
 *   '/de/news/news-test': { page: '/news_detail', query: { news_id: 'news-test' } }
 * }
 */
const getMap = () => {
  return new Promise((resolve, reject) => {
    const promises = []
    let result = {}
    Object.keys(LANGS_PRISMIC).forEach((lang) => {
      Object.keys(TYPE_ROUTES_MAPPING).forEach((docType, config) => {
        promises.push(
          new Promise((success, failure) => {
            prismicApi.getAllForType(
              docType,
              LANGS_PRISMIC[lang],
              success, 
              failure
            )
          })
        )
      })
    });
    Promise.all(promises).then(values => {
      values.map((group) => {
        group.map((item) => {
          const lang = getKeyByValue(LANGS_PRISMIC, item.lang)
          const adjustedPath = item.uid.replace(/(-(de|en))$/, '')
          const obj = {
            [`/${lang}/${adjustedPath}`]: 
            { 
              'page': TYPE_ROUTES_MAPPING[item.type].pagePath,
              'query': (TYPE_ROUTES_MAPPING[item.type].queryData) ? {[TYPE_ROUTES_MAPPING[item.type].queryData]: adjustedPath} : {}
            }
          }
          result = Object.assign(result, obj)
        })
      });
      resolve(result)
    })
  })
}

/**
 * Module exported functions
 */
module.exports = {
  getMap
}