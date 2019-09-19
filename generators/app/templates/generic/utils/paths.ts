const { languages } = require('../constants')

const { getLangFromPathHelper: langFromPath } = require('./../server/utils')
export { langFromPath }

export const adjustPath = (path, req) => {
  if (!path || path.length < 1 || path === '/') {
    path = `/home`
    if (req) {
      req.url = path
    }
  }

  if (path === '' || languages.map(lang => `/${lang}`).includes(path)) {
    path += '/home'
    if (req) {
      req.url = path
    }
  }

  return path
}

export const checkIfGlobalVars = (text: string): string => {
  const variable = text.substring(
    text.lastIndexOf('${') + 2,
    text.lastIndexOf('}')
  )
  return variable
}

export const getVarValueOnText = (
  text: string,
  variable: string,
  value: string
): string => {
  if (variable && variable.length > 0) {
    return text.replace(`\${${variable}}`, value)
  }
  return text
}

export const adjustPathReqWithLang = (path, req, lang) => {
  const pathParts = path.trim().split('/') // Divide the path by /
  // If the path is something like /pathname we make sure we add the lang to the req and remove the / from the path
  if (pathParts.length === 2) {
    pathParts.shift() // remove the space on the left
    const firstPart = pathParts.shift()
    if (!languages.includes(firstPart)) {
      path = firstPart
      if (req) {
        req.url = lang + firstPart
      }
    }
  } else {
    pathParts.shift() // remove the space on the left
    if (languages.includes(pathParts[0])) {
      pathParts.shift() // remove the lang part
    }
    path = pathParts.join('/') // Join the rest
  }

  return path
}

export const getPathAndLangForPage = (req, asPath, query): {
    lang: <%- languages.map(lang => `'${lang}'`).join(' | ') %>,
    pathId: string,
    type: string,
  } => {
  let path = adjustPath(asPath || (req ? req.url : '/'), req)
  
  // Get lang from request url
  const lang = req
    ? langFromPath(path, req)
    : query && query.lang
    ? query.lang
    : languages[0]
  path = adjustPathReqWithLang(path, req, lang)

  let pathId = path
  let type = 'page'
  const pathParts = path.split('/')
  if (pathParts.length > 1) {
    type = pathParts[pathParts.length - 2]
    pathId = pathParts[pathParts.length - 1]
  }

  return {
    lang,
    pathId:
      pathId && pathId.trim().length > 0
        ? pathId
        : adjustPathReqWithLang(asPath, null, null).replace('/', ''),
    type
  }
}

  // Avoid querying data with next.js-hot-reloading
export const isNextHR = url => !(url.indexOf('_next') < 0 && url.indexOf('/static/') < 0 && url.indexOf('on-demand-entries-ping') < 0)
