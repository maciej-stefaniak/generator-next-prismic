import { UI, MENU_OPENED, COOKIE_MESSAGE_VISIBLE } from './types'

export const menuOpen = () => {
  return {
    type: UI,
    subType: MENU_OPENED,
    payload: true
  }
}

export const menuClose = () => {
  return {
    type: UI,
    subType: MENU_OPENED,
    payload: false
  }
}

export const showCookieMessage = () => {
  return {
    type: UI,
    subType: COOKIE_MESSAGE_VISIBLE,
    payload: true
  }
}

export const hideCookieMessage = () => {
  return {
    type: UI,
    subType: COOKIE_MESSAGE_VISIBLE,
    payload: false
  }
}
