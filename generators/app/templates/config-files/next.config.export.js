const fs = require('fs')
const path = require('path')

const prismicApi = require('./server/prismic')
const sitemap = require('./server/sitemap')
const { languages, websiteURL } = require('./constants')

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
 * Helper function for searching for a key for a given value  
 */
const getKeyByValue = (object, value) => {
  return Object.keys(object).find(key => object[key] === value);
}

/**
 * Genrerates sitemap.xml file into static folder
 */
const generateSiteMap = () => {
  sitemap(prismicApi)
}

/**
 * Generates redirection files for home page and language homes
 */
const generateRedirectFiles = () => {
  
  // Iterate through languages and create redirection files
  languages.map((lang, index) => {
    
    const fileString  = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${websiteURL}/${lang}/home" /></head><body></body></html>`

    // Create export folder for given language
    fs.mkdirSync(path.join(__dirname, `export/redirects/${lang}`), { recursive: true }, (err) => {
      console.log(`Error generating export dir`, err)
    })

    // Write redirection HTML into file
    fs.writeFile(
      path.join(__dirname, `export/redirects/${lang}`, 'index.html'), 
      fileString, 
      (err, data) => {
        if (err) {
          console.log(`Error generating ${lang} redirection file`, err)
        }
      })

    // Root file
    if (index === 0) {
      // Write redirection HTML into root file
      fs.writeFile(
        path.join(__dirname, `export/redirects`, 'index.html'), 
        fileString, 
        (err, data) => {
          if (err) {
            console.log(`Error generating root redirection file`, err)
          }
        })
    }
  });
  console.log(`Redirection files generated`)
}


const getCommonDocumentsForLang = (lang, commonDocumentsForLangs) => {
  return new Promise((resolve, reject) => {
      prismicApi.getDocumentsPage(null, null, null, lang).then((value) => {
      commonDocumentsForLangs[lang] = value;
      resolve();
    }).catch((e) => {
      console.log('getCommonDocumentsForLang', e)
      reject(e); 
    });
  });
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
const getMap = async (outDir) => {
  generateSiteMap()
  generateRedirectFiles()

  let commonDocumentsForLangs = {};

  await Promise.all(languages.map(async lang => {
    await getCommonDocumentsForLang(lang, commonDocumentsForLangs)
    return lang;
  }));

  return new Promise((resolve, reject) => {
    const promises = []
    let result = {}
    Object.keys(prismicApi.LANGS_PRISMIC).forEach((lang) => {
      Object.keys(TYPE_ROUTES_MAPPING).forEach((docType, config) => {
        promises.push(
          new Promise((success, failure) => {
            prismicApi.getAllForType(
              null,
              docType,
              prismicApi.LANGS_PRISMIC[lang],
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
          const lang = getKeyByValue(prismicApi.LANGS_PRISMIC, item.lang)
          const adjustedPath = item.uid.replace(/(-(de|en))$/, '')

          //Write content file for static prefetch of pages
          //Create export folder for given language
          fs.mkdirSync(`${outDir}/${lang}/${adjustedPath}`, { recursive: true }, (err) => {
            console.log(`Error generating export dir`, err)
          })
          try {
            fs.writeFile(
              path.join(`${outDir}/${lang}/${adjustedPath}`, 'content.json'), 
              JSON.stringify({ ...commonDocumentsForLangs[lang], ...item.data } || commonDocumentsForLangs[lang]), 
              (err, data) => {
                if (err) {
                  console.log(`Error generating content data file for ${lang}/${adjustedPath} file`, err)
                }
              })
          } catch (e) {
            console.log(`Error generating content data file for ${lang}/${adjustedPath} file`, e)
          }

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