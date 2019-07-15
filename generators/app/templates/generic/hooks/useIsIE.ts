import React, { useState, useEffect } from 'react'
import { isIE } from '../utils'

const useIsIE = () => {
  const [isIEVar, setIsIEVar] = useState(false)

  useEffect(() => {
    setIsIEVar(isIE())
  }, [])

  return isIEVar
}

export default useIsIE
