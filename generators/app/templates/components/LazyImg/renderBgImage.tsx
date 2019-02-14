import * as React from 'react'

import { ILazyImgProps } from './LazyImg'

import { isNode } from '../../utils'

export default (
  { status },
  style: any,
  props: ILazyImgProps
): React.ReactNode => {
  const { src, children, backgroundColor, elId, spaceHolderFix } = props
  const bgSrcNotLoaded = isNode ? `url(${src})` : 'none'

  let s = style
  if (backgroundColor) {
    s.backgroundColor = backgroundColor
  }
  if (spaceHolderFix) {
    s = {
      ...style,
      height: 0,
      paddingTop: `${spaceHolderFix}%`
    }
  }

  return isNode ? (
    <noscript>
      <div
        id={elId}
        className="LazyImg-in LazyImg-el LazyImg-bg loaded"
        style={{
          ...s,
          backgroundImage: status === 'LOADED' ? `url(${src})` : bgSrcNotLoaded
        }}
      >
        {children}
      </div>
    </noscript>
  ) : (
    <div
      id={elId}
      className={`LazyImg-in LazyImg-el LazyImg-bg ${status.toLowerCase()}`}
      style={{
        ...s,
        backgroundImage: status === 'LOADED' ? `url(${src})` : bgSrcNotLoaded
      }}
    >
      {children}
    </div>
  )
}
