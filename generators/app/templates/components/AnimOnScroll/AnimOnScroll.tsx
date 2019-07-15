import React, { useState, useEffect } from 'react'

import useIsIE from '../../hooks/useIsIE'

import AnimOnScrollNoIE, { IAnimOnScrollProps } from './AnimOnScrollNoIE'

const AnimOnScroll = (props: IAnimOnScrollProps) => {
  const isIE = useIsIE()

  return isIE || props.disable ? (
    <span className={props.className || ''}>{props.children}</span>
  ) : (
    <AnimOnScrollNoIE {...props} />
  )
}

export default AnimOnScroll
