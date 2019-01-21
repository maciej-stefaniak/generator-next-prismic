const AcceptLanguageParser = require('accept-language-parser')
const { languages } = require('../constants')

module.exports.getLangFromPathHelper = (pathname, req) => {
  let lang = pathname.split('/')[1]

  if (!lang || !languages.includes(lang)) {
    const acceptLanguage =
      req && req.headers && req.headers['accept-language']
        ? req.headers['accept-language']
        : null
    let preferedLang
    if (acceptLanguage) {
      const preferedLangList = AcceptLanguageParser.parse(acceptLanguage)
      preferedLang =
        preferedLangList &&
        preferedLangList.length &&
        preferedLangList[0].quality >= 1
          ? preferedLangList[0].code
          : null
    }
    lang = languages.includes(preferedLang) ? preferedLang : languages[0]
  }

  return lang
}

module.exports.addLangIfNotInUrl = (url, userLang) => {
  if (!url.startsWith('/en') && !url.startsWith('/de')) {
    return `/${userLang}${url}`
  }
  return url
}
