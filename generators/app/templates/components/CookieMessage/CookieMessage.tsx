import React, { useState, useEffect } from 'react'
import { animated, useSpring } from 'react-spring/web.cjs'

import { isNode } from '../../utils'

import { Markdown } from '..'

import './styles.scss'

type ICookieMessageProps = {
  cookie_message?: any[]
  accept_cookies_button: string
}

let showCookieMessageTimeout

const CookieMessage = ({
  cookie_message,
  accept_cookies_button = 'Agree'
}: ICookieMessageProps) => {
  const [opened, setOpened] = useSpring(() => ({
    from: { y: 100 }
  }))

  const showCookieMessage = () => {
    setOpened({ y: 0 })
  }

  const hideCookieMessage = () => {
    setOpened({ y: 100 })
  }

  const acceptCookies = () => {
    hideCookieMessage()
    withCookieAccepted()
    // Save cookie-accepted in localStorage to not show again
    try {
      if (!isNode && window.localStorage) {
        window.localStorage.setItem('cookie-accepted', new Date().toString())
      }
    } catch (e) {
      console.log('No cookies allowed')
    }
  }

  const withCookieAccepted = () => {
    if (process.env.NODE_ENV === 'production') {
      // Add code which requires cookies, eg. GTag
    } else {
      // Won't add analytics
    }
  }

  useEffect(() => {
    let toShow = true
    // Only show cookie message if it has not been accepted yet
    try {
      if (!isNode && window.localStorage) {
        toShow = !window.localStorage.getItem('cookie-accepted')
      }
    } catch (e) {
      console.log('No cookies allowed')
    }

    if (toShow) {
      // Cookie not accepted
      showCookieMessageTimeout = setTimeout(() => {
        showCookieMessage()
      }, 2500)
    } else {
      // Cookie alredy accepted
      withCookieAccepted()
    }

    return () => {
      clearTimeout(showCookieMessageTimeout)
    }
  })

  if (!cookie_message) return null
  return (
    <div className="CookieMessage">
      <animated.div
        className="CookieMessage-in"
        style={{
          transform: opened.y.interpolate(y => `translate3d(0, ${y}%, 0)`)
        }}
      >
        <div className="container">
          <div>
            <Markdown input={cookie_message} />
            <button onClick={acceptCookies}>{accept_cookies_button}</button>
          </div>
        </div>
      </animated.div>
    </div>
  )
}

export default CookieMessage
