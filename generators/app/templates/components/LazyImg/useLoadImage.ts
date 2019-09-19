import { useEffect, useReducer } from 'react'

import loadInlineSvg from './loadInlineSvg'
import { ILazyImgProps, ILazyImgState } from './LazyImg'

import { isIE, isNode } from '../../utils'

const useLoadImage = (props: ILazyImgProps): ILazyImgState => {
  const { src, timeout, inlineSvg } = props
  let loadTimeout

  const [state, dispatch] = useReducer(
    (state: ILazyImgState, action) => {
      clearTimeout(loadTimeout)
      switch (action.type) {
        case 'LOADED':
          if (props.onLoad) props.onLoad()
          return { ...state, status: 'LOADED' }
        case 'FAILED':
          const { error } = action.payload
          console.error('e: ', error, src)
          if (props.onError) props.onError(error)
          return { ...state, status: 'FAILED' }
        case 'INLINE_SVG_LOADED':
          if (props.onLoad) props.onLoad()
          return {
            ...state,
            svgInlineCode: action.payload.svgInlineCode,
            status: 'LOADED'
          }
        case 'INLINE_SVG_FAILED':
          if (props.onError) props.onError('Inline SVG failed')
          return {
            ...state,
            inlineSvgFallback: action.payload.inlineSvgFallback,
            status: 'LOADED'
          }
        default:
          return state
      }
    },
    {
      status: 'LOADING',
      svgInlineCode: null,
      inlineSvgFallback: null
    }
  )

  /*
   * Starts/triggers the loading of the image source
   */
  useEffect(
    () => {
      let mounted = true
      if (src) {
        if (inlineSvg) {
          loadInlineSvg(src, props, dispatch, mounted)
        } else {
          const imgElem = document.createElement('img')
          imgElem.onload = () => {
            if (!mounted) return
            dispatch({ type: 'LOADED' })
          }
          imgElem.onerror = e => {
            if (!mounted) return
            dispatch({ type: 'FAILED', payload: { error: e } })
          }
          imgElem.src = src

          if (timeout) {
            loadTimeout = setTimeout(
              () => dispatch({ type: 'FAILED', payload: { error: 'timeout' } }),
              timeout
            )
          }

          if (!isNode && isIE()) {
            if (imgElem.complete) {
              dispatch({ type: 'LOADED' })
            }
          }
        }
      }

      return () => {
        mounted = false
        clearTimeout(loadTimeout)
      }
    },
    [src]
  )

  return state as ILazyImgState
}

export default useLoadImage
