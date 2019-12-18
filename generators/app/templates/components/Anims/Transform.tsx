import * as React from 'react'

import { useSpring, animated } from 'react-spring/web.cjs'

type ITransformProps = {
  children?: React.ReactNode | React.ReactNode[]
  className?: string
  opacityChange?: boolean
  from?: [number, number, number, number] // Following format: [x, y, scale, rotate]
  to?: [number, number, number, number] // Following format: [x, y, scale, rotate]
  delay?: number
  config?: {
    mass: number
    tension: number
    friction: number
    precision?: number
  }
}

const Transform = ({
  children,
  className = '',
  from,
  to,
  opacityChange = true,
  delay = 0,
  config
}: ITransformProps) => {
  const [propsSlide] = useSpring(() => ({
    from: {
      opacity: opacityChange ? 0 : 1,
      xysr: from ? from : [80, 0, 1, 0]
    },
    to: { opacity: 1, xysr: to ? to : [0, 0, 1, 0] },
    config: config
      ? config
      : { mass: 10, tension: 420, friction: 140, precision: 0.0025 },
    delay
  }))

  return (
    <animated.span
      className={`Transform ${className}`}
      style={{
        opacity: propsSlide.opacity,
        transform: propsSlide.xysr.interpolate(
          (x, y, s, r) =>
            `translate3d(${x}%, ${y}%, 0) scale(${s}) rotate(${r}deg)`
        )
      }}
    >
      {children}
    </animated.span>
  )
}

export default Transform
