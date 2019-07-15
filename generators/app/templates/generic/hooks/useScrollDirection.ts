import React, { useState, useEffect } from 'react'
import { throttle, debounce } from 'throttle-debounce'

const getViewportHeight = () => {
  const result = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  )

  return result
}

let prevScroll = 0
let heroHeight = 0

const useScrollDirection = (heightTrigger?: number) => {
  const [scrollDirection, setScrollDirection] = useState('down')

  const scrollHandler = throttle(300, () => {
    setScrollDirection(
      prevScroll === 0 ||
        prevScroll < window.pageYOffset ||
        window.pageYOffset < (heightTrigger ? heightTrigger : heroHeight) + 100
        ? 'down'
        : 'up'
    )
    prevScroll = window.pageYOffset
  })

  const resizeHandler = debounce(1000, () => {
    heroHeight = getViewportHeight()
  })

  useEffect(() => {
    heroHeight = getViewportHeight()
    window.addEventListener('scroll', scrollHandler)
    window.addEventListener('resize', resizeHandler)
    return () => {
      window.removeEventListener('scroll', scrollHandler)
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  return scrollDirection
}

export default useScrollDirection
