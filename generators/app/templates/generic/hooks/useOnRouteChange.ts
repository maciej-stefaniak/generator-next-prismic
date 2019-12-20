import { useState, useEffect } from 'react'
import Router from 'next/router'

import { isNode } from '../utils'

const getParamsObject = url => {
  if (isNode) return null

  const urlSplitted = decodeURI(url).split('?')[1]

  return urlSplitted
    ? urlSplitted.split('&').reduce((data, item) => {
        const [key, value] = item.split('=')

        data[key] = value

        return data
      }, {})
    : null
}

const useOnRouteChange = () => {
  const [currentRoute, setCurrentRoute] = useState(
    isNode ? null : Router.asPath
  )
  const [currentParams, setCurrentParams] = useState(
    getParamsObject(currentRoute)
  )

  const handleRouteChange = url => {
    setCurrentRoute(url)
    setCurrentParams(getParamsObject(url))
  }

  useEffect(() => {
    Router.events.on('routeChangeComplete', handleRouteChange)
    Router.events.on('hashChangeComplete', handleRouteChange)
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange)
      Router.events.off('hashChangeComplete', handleRouteChange)
    }
  }, [])

  return { route: currentRoute, params: currentParams }
}

export default useOnRouteChange
