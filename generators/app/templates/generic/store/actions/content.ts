import fetch from 'isomorphic-unfetch'

import { FETCH_CONTENT, FETCH_DOCUMENT, FETCH_CONTENT_TYPE } from './types'

export const getPage = (req: any, path: string, lang: <%- languages.map(lang => `'${lang}'`).join(' | ') %>) => async (
  dispatch,
  getState
) => {
  try {
    const protocol =
      req && req.headers ? req.headers['x-forwarded-proto'] || 'http' : ''
    const baseUrl =
      req && req.headers ? `${protocol}://${req.headers.host}` : ''

    // Server is running
    if (!process.env.EXPORT) {
      const res = await fetch(`${baseUrl}/api-page?lang=${lang}&path=${path}`)

      const data = await res.json()
      dispatch({
        type: FETCH_CONTENT,
        subType: path,
        payload: data
      })
    }
    // Server is NOT running - export mode
    else {
      const prismicApi = require('./../../server/prismic')
      const data = await prismicApi.getDocumentsPage({}, path, lang)
      if (data) {
        dispatch({
          type: FETCH_CONTENT,
          subType: path,
          payload: data
        })
      }
    }
  } catch (e) {
    dispatch({
      type: FETCH_CONTENT,
      subType: path,
      payload: { error: 'Something did not work as expected' }
    })
    console.error(`GET page(${path}) error: ${e}`)
  }
}

export const getDocument = (
  req: any,
  path: string,
  lang: <%- languages.map(lang => `'${lang}'`).join(' | ') %>
) => async (dispatch, getState) => {
  try {
    const protocol =
      req && req.headers ? req.headers['x-forwarded-proto'] || 'http' : ''
    const baseUrl =
      req && req.headers ? `${protocol}://${req.headers.host}` : ''
    const res = await fetch(`${baseUrl}/api-document?path=${path}&lang=${lang}`)
    const data = await res.json()
    dispatch({
      type: FETCH_DOCUMENT,
      subType: path,
      payload: data
    })
  } catch (e) {
    dispatch({
      type: FETCH_DOCUMENT,
      subType: path,
      payload: { error: 'Something did not work as expected' }
    })
    console.error(`GET document(${path}) error: ${e}`)
  }
}

export const getAllDocumentsOfType = (
  req: any,
  documenType: string,
  lang: <%- languages.map(lang => `'${lang}'`).join(' | ') %>
) => async (dispatch, getState) => {
  try {
    const protocol =
      req && req.headers ? req.headers['x-forwarded-proto'] || 'http' : ''
    const baseUrl =
      req && req.headers ? `${protocol}://${req.headers.host}` : ''
    const res = await fetch(
      `${baseUrl}/api-all-documents?type=${documenType}&lang=${lang}`
    )
    const data = await res.json()
    dispatch({
      type: FETCH_CONTENT_TYPE,
      subType: documenType,
      payload: data
    })
  } catch (e) {
    dispatch({
      type: FETCH_CONTENT_TYPE,
      subType: documenType,
      payload: { error: 'Something did not work as expected' }
    })
    console.error(`GET all-documents(${documenType}) error: ${e}`)
  }
}

export const getStaticContent = (
  asPath: string,
  pathId: string,
  lang: string
) => async dispatch => {
  try {
    const requestedUrl = asPath === '/' ? `/${lang}/home` : asPath
    const res = await fetch(`${requestedUrl.replace(/\/$/, '')}/content.json`)
    const data = await res.json()
    dispatch({
      type: FETCH_CONTENT,
      subType: pathId,
      payload: data
    })
  } catch (e) {
    console.log(`Error fetching content file for ${asPath}: `, e)
  }
}
