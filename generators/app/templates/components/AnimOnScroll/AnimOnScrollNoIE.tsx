import React, { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { animated, useSpring } from 'react-spring/web.cjs'
import 'intersection-observer'

import classnames from 'classnames'
import { isNode, isIE, w } from '../../utils'

import './styles.scss'

export type IAnimOnScrollProps = {
  disable?: boolean
  animType?: 'none' | 'up' | 'down' | 'left' | 'right'
  children?: any
  delay?: number
  easing?: any
  duration?: number
  from?: [number, number, number, number, number]
  to?: [number, number, number, number, number]
  updateClass?: boolean
  opacityChange?: boolean
  clearAtRest?: boolean
  className?: string
  node?: string
  precision?: number
  config?: any
}

const ANIMS = {
  none: [0, 0, 1, 1, 0],
  up: [0, 15, 1, 1, 0],
  left: [-15, 0, 1, 1, 0],
  right: [15, 0, 1, 1, 0],
  down: [0, -15, 1, 1, 0]
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
  clearAtRest = true,
  from,
  to,
  config,
  precision = 0.01
}: IAnimOnScrollProps) => {
  const [clearFinished, setClearFinished] = useState(false)
  const [viewRef, inView] = useInView({
    /* Optional options */
    triggerOnce: true
  })
  const [useObserver, setUseObserver] = useState(!isIE())

  const forceNoAnim = isNode || isIE()
  useEffect(() => {
    setUseObserver(
      !isNode &&
        !isIE() &&
        ('IntersectionObserver' in w &&
          'IntersectionObserverEntry' in w &&
          'intersectionRatio' in w.IntersectionObserverEntry.prototype &&
          'isIntersecting' in w.IntersectionObserverEntry.prototype)
    )
  }, [forceNoAnim])

  const [isNodeComponent, setIsNodeComponent] = useState(true)
  useEffect(() => {
    setIsNodeComponent(false)
  }, [])

  const animation = useSpring({
    from: {
      opacity: useObserver && opacityChange ? 0 : 1,
      xysr: useObserver ? (from ? from : ANIMS[animType]) : [0, 0, 1, 1, 0]
    },
    to: inView
      ? {
          opacity: 1,
          xysr: to ? to : [0, 0, 1, 1, 0]
        }
      : {},
    delay,
    config:
      easing && duration
        ? {
            duration,
            easing
          }
        : config
        ? config
        : {
            mass: 1,
            tension: 160,
            friction: 26,
            precision
          },
    onRest: () => {
      if (clearAtRest) {
        setClearFinished(true)
      }
    }
  })

  const Anim = animated[node]
  const NodeTag = node

  return useObserver ? (
    <Anim
      ref={viewRef}
      className={classnames([
        'AnimOnScroll',
        className,
        { finished: clearAtRest && clearFinished },
        { 'in-view': inView && updateClass },
        { 'is-node': isNodeComponent }
      ])}
      style={
        !clearFinished
          ? {
              transform: animation.xysr.interpolate(
                (x, y, sx, sy, r) =>
                  `translate3d(${x}%, ${y}%, 0) scaleX(${sx}) scaleY(${sy}) rotate(${r}deg)`
              ),
              opacity: animation.opacity
            }
          : {}
      }
    >
      {children}
    </Anim>
  ) : (
    <NodeTag>{children}</NodeTag>
  )
}

export default AnimOnScroll
