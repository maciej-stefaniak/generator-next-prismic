import fetch from 'isomorphic-unfetch'

import { FETCH_CONTENT, FETCH_DOCUMENT, FETCH_CONTENT_TYPE } from './types'

export const getPage = (
  req: any,
  documentId: string,
  documenType: string,
  lang: <%= languages ? languages.join(' | ') : 'de' %>
) => async (dispatch, getState) => {
  try {
    const protocol = req ? req.headers['x-forwarded-proto'] || 'http' : ''
    const baseUrl = req ? `${protocol}://${req.headers.host}` : ''
    const res = await fetch(
      `${baseUrl}/api-page?id=${documentId}&type=${documenType}&lang=${lang}`
    )
    const data = await res.json()
    dispatch({
      type: FETCH_CONTENT,
      subType: documentId,
      payload: data
    })
  } catch (e) {
    dispatch({
      type: FETCH_CONTENT,
      subType: documentId,
      payload: { error: 'Something did not work as expected' }
    })
    console.error(`GET page(${documentId}) error: ${e}`)
  }
}

export const getDocument = (
  req: any,
  documentId: string,
  documenType: string,
  lang: 'en' | 'de'
) => async (dispatch, getState) => {
  try {
    const protocol = req ? req.headers['x-forwarded-proto'] || 'http' : ''
    const baseUrl = req ? `${protocol}://${req.headers.host}` : ''
    const res = await fetch(
      `${baseUrl}/api-document?id=${documentId}&type=${documenType}&lang=${lang}`
    )
    const data = await res.json()
    dispatch({
      type: FETCH_DOCUMENT,
      subType: documentId,
      payload: data
    })
  } catch (e) {
    dispatch({
      type: FETCH_DOCUMENT,
      subType: documentId,
      payload: { error: 'Something did not work as expected' }
    })
    console.error(`GET document(${documentId}) error: ${e}`)
  }
}

export const getAllDocumentsOfType = (
  req: any,
  documenType: string,
  lang: 'en' | 'de'
) => async (dispatch, getState) => {
  try {
    const protocol = req ? req.headers['x-forwarded-proto'] || 'http' : ''
    const baseUrl = req ? `${protocol}://${req.headers.host}` : ''
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
