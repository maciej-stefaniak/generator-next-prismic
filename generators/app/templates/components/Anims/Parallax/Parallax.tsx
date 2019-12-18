import React from 'react'

import useIsIE from '../../../hooks/useIsIE'
import { isDevice } from '../../../utils'
import ParallaxNoIE, { IParallaxProps } from './ParallaxNoIE'

const Parallax = (props: IParallaxProps) => {
  const isIE = useIsIE()
  const NodeTag = props.node ? props.node : 'span'

  return isDevice() || isIE || props.disable ? (
    <NodeTag
      className={`Parallax-container ${props.className ? props.className : ''}`}
    >
      {props.children}
    </NodeTag>
  ) : (
    <ParallaxNoIE {...props} />
  )
}

export default Parallax
