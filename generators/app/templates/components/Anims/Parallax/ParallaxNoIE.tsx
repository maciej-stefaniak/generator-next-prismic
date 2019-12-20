import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSpring, animated as a } from 'react-spring/web.cjs'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import 'intersection-observer'

import useScreenSize from '../../../hooks/useScreenSize'

import { isNode, isIE, isDevice, w } from '../../../utils'

import './styles.scss'

export type IParallaxProps = {
  node?: string
  disable?: boolean
  children?: React.ReactNode | React.ReactNode[]
  className?: string
  baseY?: number
  horizontal?: boolean
  speed?: number
  config?: {
    mass: number
    tension: number
    friction: number
    precision?: number
  }
}

const getElemDistanceTop = elem => {
  // Get an element's distance from the top of the page
  var location = 0
  if (elem.offsetParent) {
    do {
      location += elem.offsetTop
      elem = elem.offsetParent
    } while (elem)
  }
  return location >= 0 ? location : 0
}

const MIN_WIDTH_FOR_PARALLAX = 800
const Parallax = ({
  children,
  className = '',
  baseY = 0,
  speed = 0.5,
  horizontal = false,
  config,
  ...props
}: IParallaxProps) => {
  const parallaxRef = useRef(null)
  const [offsetTop, setOffsetTop] = useState(null)
  const [useObserver, setUseObserver] = useState(!isIE())
  const { width: windowWidth, height: windowHeight } = useScreenSize()
  const forceNoAnim =
    isNode || isIE() || isDevice() || windowWidth < MIN_WIDTH_FOR_PARALLAX

  useEffect(() => {
    setUseObserver(
      !(
        isNode ||
        isIE() ||
        isDevice() ||
        windowWidth < MIN_WIDTH_FOR_PARALLAX
      ) &&
        ('IntersectionObserver' in w &&
          'IntersectionObserverEntry' in w &&
          'intersectionRatio' in w.IntersectionObserverEntry.prototype &&
          'isIntersecting' in w.IntersectionObserverEntry.prototype)
    )
  }, [forceNoAnim])
  const [{ st }, set] = useSpring(() => ({
    st: 0,
    config: { mass: 1, tension: 170, friction: 26, presion: 0.007 }
  }))

  useEffect(() => {
    set({ immediate: !useObserver })
  }, [useObserver])

  useScrollPosition(({ prevPos, currPos }) => {
    if (useObserver) {
      set({
        st: -currPos.y
      })
    }
  })

  useEffect(() => {
    set({ immediate: !useObserver })
  }, [useObserver])

  useEffect(() => {
    const checkOffsetTop = () => {
      if (useObserver) {
        setOffsetTop(
          parallaxRef && parallaxRef.current
            ? getElemDistanceTop(parallaxRef.current)
            : 0
        )
      }
    }
    window.addEventListener('load', checkOffsetTop, false)
    if (useObserver) {
      checkOffsetTop()
    }
    return () => {
      window.removeEventListener('load', checkOffsetTop, false)
    }
  }, [windowHeight, windowWidth, useObserver])

  const scrollMovement = st.interpolate(o => {
    return horizontal
      ? `translate3d(${baseY + (o - offsetTop) / (1 / (speed / 5))}px,0, 0)`
      : `translate3d(0, ${
          baseY + (o - offsetTop) / (1 / (speed / 5)) //: 0
        }px, 0)`
  })

  return (
    <a.span
      ref={parallaxRef}
      className={`Parallax-container ${className}`}
      style={
        useObserver
          ? {
              transform: scrollMovement
            }
          : {}
      }
      {...props}
    >
      {children}
    </a.span>
  )
}

export default Parallax
