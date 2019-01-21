import { UI, MENU_OPENED, COOKIE_MESSAGE_VISIBLE } from './types'

export const menuOpen = () => (dispatch, getState) => {
  dispatch({
    type: UI,
    subType: MENU_OPENED,
    payload: true
  })
}

export const menuClose = () => (dispatch, getState) => {
  dispatch({
    type: UI,
    subType: MENU_OPENED,
    payload: false
  })
}

export const showCookieMessage = () => (dispatch, getState) => {
  dispatch({
    type: UI,
    subType: COOKIE_MESSAGE_VISIBLE,
    payload: true
  })
}

export const hideCookieMessage = () => (dispatch, getState) => {
  dispatch({
    type: UI,
    subType: COOKIE_MESSAGE_VISIBLE,
    payload: false
  })
}
