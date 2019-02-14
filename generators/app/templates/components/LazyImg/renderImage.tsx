import * as React from 'react'

import { ILazyImgProps } from './LazyImg'

import { isNode } from '../../utils'

const loadingImg =
  'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

export default (
  { status, svgInlineCode = null, inlineSvgFallback = null },
  style: any,
  props: ILazyImgProps
): React.ReactNode => {
  const { src, elId, alt, spaceHolderFix, inlineSvg } = props
  const srcNotLoaded = isNode ? src : loadingImg

  const fileName = src
    ? src
        .split('/')
        .pop()
        .split('.')[0]
    : ''

  const altText = alt || fileName

  let s = style
  if (spaceHolderFix) {
    s = {
      ...style,
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: 'auto'
    }
  }

  return (
    <span className="LazyImg-in LazyImg-img">
      <span>
        {svgInlineCode && inlineSvg ? (
          <span
            className={`LazyImg-el LazyImg-inline-svg ${status.toLowerCase()}`}
            style={s}
            dangerouslySetInnerHTML={{ __html: svgInlineCode }}
          />
        ) : !isNode ? (
          <img
            id={elId}
            className={`LazyImg-el ${status.toLowerCase()}`}
            src={status === 'LOADED' ? inlineSvgFallback || src : srcNotLoaded}
            style={s}
            alt={altText}
          />
        ) : (
          <noscript>
            <img
              id={elId}
              className="LazyImg-el loaded"
              src={srcNotLoaded}
              style={s}
              alt={altText}
            />
          </noscript>
        )}
      </span>

      {spaceHolderFix && (
        <span
          className="spaceHolderFix"
          style={{
            position: 'relative',
            width: '100%',
            paddingTop: `${spaceHolderFix}%`,
            display: 'block'
          }}
        />
      )}
    </span>
  )
}
