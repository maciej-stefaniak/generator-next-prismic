import React, { useState, useEffect } from 'react'
import { debounce } from 'throttle-debounce'

import { isNode } from '../utils'

const getViewportWidth = () => {
  const result = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  )

  return result
}

const useScreenSize = (debounceTime = 1000) => {
  const [windowWidth, setWindowWidth] = useState(1000)

  const resizeHandler = debounce(debounceTime, () => {
    setWindowWidth(getViewportWidth())
  })

  useEffect(() => {
    window.addEventListener('resize', resizeHandler)
    if (!isNode) {
      setWindowWidth(getViewportWidth())
    }
    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  return windowWidth
}

export default useScreenSize
