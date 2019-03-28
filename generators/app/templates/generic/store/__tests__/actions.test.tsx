import { UI, MENU_OPENED, COOKIE_MESSAGE_VISIBLE } from './../actions/types'
import { menuOpen, menuClose, showCookieMessage, hideCookieMessage } from './../actions/ui'

describe('Actions tests', () => {
  it('Are UI menu actions working properly', () => {
    const actionMenuOpen = menuOpen();
    const actionMenuClose = menuClose();
    
    expect(actionMenuOpen.subType).toEqual(MENU_OPENED)
    expect(actionMenuOpen.payload).toEqual(true)
    expect(actionMenuClose.subType).toEqual(MENU_OPENED)
    expect(actionMenuClose.payload).toEqual(false)
  })

  it('Are UI cookie message actions working properly', () => {
    const actionShowCookie = showCookieMessage();
    const actionHideCookie = hideCookieMessage();
    
    expect(actionShowCookie.subType).toEqual(COOKIE_MESSAGE_VISIBLE)
    expect(actionShowCookie.payload).toEqual(true)
    expect(actionHideCookie.subType).toEqual(COOKIE_MESSAGE_VISIBLE)
    expect(actionHideCookie.payload).toEqual(false)
  })
  
})