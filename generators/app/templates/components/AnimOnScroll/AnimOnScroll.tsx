import React from 'react'

import useIsIE from '../../hooks/useIsIE'

import AnimOnScrollNoIE, { IAnimOnScrollProps } from './AnimOnScrollNoIE'

const AnimOnScroll = (props: IAnimOnScrollProps) => {
  const isIE = useIsIE()
  const NodeTag = props.node ? props.node : 'span'

  return isIE || props.disable ? (
    <NodeTag className={props.className || ''}>{props.children}</NodeTag>
  ) : (
    <AnimOnScrollNoIE {...props} />
  )
}

export default AnimOnScroll
