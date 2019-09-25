import React, { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { animated, useSpring } from 'react-spring/web.cjs'
import NoSSR from 'react-no-ssr'

import { isNode, isIE, w } from '../../utils'

import './styles.scss'

export type IAnimOnScrollProps = {
  disable?: boolean
  animType?: 'none' | 'up' | 'down' | 'left' | 'right'
  children?: any
  delay?: number
  easing?: any
  duration?: number
  from?: [number, number, number, number]
  to?: [number, number, number, number]
  updateClass?: boolean
  opacityChange?: boolean
  className?: string
  node?: string
  precision?: number
}

const ANIMS = {
  none: [0, 0, 1, 0],
  up: [0, 15, 1, 0],
  left: [-15, 0, 1, 0],
  right: [15, 0, 1, 0],
  down: [0, -15, 1, 0]
}

const AnimOnScroll = ({
  disable = false,
  node = 'span',
  animType = 'up',
  className = '',
  delay = 150,
  children,
  easing,
  duration,
  opacityChange = true,
  updateClass = false,
  from,
  to,
  precision = 0.01
}: IAnimOnScrollProps) => {
  const [viewRef, inView] = useInView({
    /* Optional options */
    triggerOnce: true
  })

  const [useObserver, setUseObserver] = useState(!isIE())

  const forceNoAnim = isNode || isIE()
  useEffect(
    () => {
      setUseObserver(
        !isNode &&
          !isIE() &&
          ('IntersectionObserver' in w &&
            'IntersectionObserverEntry' in w &&
            'intersectionRatio' in w.IntersectionObserverEntry.prototype &&
            'isIntersecting' in w.IntersectionObserverEntry.prototype)
      )
    },
    [forceNoAnim]
  )

  const [isNodeComponent, setIsNodeComponent] = useState(true)
  useEffect(() => {
    setIsNodeComponent(false)
  }, [])

  const animation = useSpring({
    from: {
      opacity: useObserver && opacityChange ? 0 : 1,
      xysr: useObserver ? (from ? from : ANIMS[animType]) : [0, 0, 1, 0]
    },
    to: inView
      ? {
          opacity: 1,
          xysr: to ? to : [0, 0, 1, 0]
        }
      : {},
    delay,
    config:
      easing && duration
        ? {
            duration,
            easing
          }
        : {
            mass: 1,
            tension: 160,
            friction: 26,
            precision
          }
  })

  const Anim = animated[node]
  const NodeTag = node

  return useObserver ? (
    <NoSSR
      onSSR={
        <div
          className={`${
            isIE() ? '' : 'AnimOnScroll-noscript hideSSR'
          } ${className}`}
        >
          {children}
        </div>
      }
    >
      <Anim
        ref={viewRef}
        className={`AnimOnScroll ${className} ${
          inView && updateClass ? 'in-view' : ''
        } ${isNodeComponent ? 'is-node' : ''}`}
        style={{
          transform: animation.xysr.interpolate(
            (x, y, s, r) =>
              `translate3d(${x}%, ${y}%, 0) scale(${s}) rotate(${r}deg)`
          ),
          opacity: animation.opacity
        }}
      >
        {children}
      </Anim>
    </NoSSR>
  ) : (
    <NodeTag>{children}</NodeTag>
  )
}

export default AnimOnScroll
