import React from 'react'
import classnames from 'classnames'

import './styles.scss'

import useLoadImage from './useLoadImage'

import renderImage from './renderImage'
import renderBackgroundImage from './renderBgImage'

import { isNode } from '../../utils'

export type ILazyImgProps = {
  src: string

  /*
   * For when using isBackground property. To have children inside of this element
   */
  children?: React.ReactNode | React.ReactNode[]

  /*
   * To use div with background-image instead of img element
   */
  isBackground?: boolean

  backgroundColor?: string

  /*
   * ID of the element
   */
  elId?: string

  className?: string
  alt?: string

  /*
   * Timeout after which the image should have loaded correctly. Otherwise throw error
   */
  timeout?: number

  spaceHolderFix?: number
  manuallyLoaded?: boolean

  /*
   * To fetch and inject the inline svg instead of an img (with svg src)
   */
  inlineSvg?: boolean
  inlineSvgFallback?: string

  /*
   * Extra styling for the element
   */
  style?: any

  /*
   * Some callbacks
   */
  onLoad?: () => void
  onError?: (error: string) => void
  onClick?: () => void
}

export type ILazyImgState = {
  status: 'LOADING' | 'LOADED' | 'FAILED'
  inlineSvgFallback?: string
  svgInlineCode?: string
}

const LazyImg: React.FC<ILazyImgProps> = props => {
  const state: ILazyImgState = useLoadImage(props)
  const {
    onClick,
    className = '',
    isBackground,
    backgroundColor,
    style
  } = props
  const opacityStyle = {
    opacity: state.status === 'LOADED' || isNode ? 1 : 0
  }

  return (
    <span
      style={
        backgroundColor ? { ...style, background: backgroundColor } : style
      }
      className={classnames('LazyImg', className)}
      onClick={() => !!onClick && onClick()}
    >
      {isBackground
        ? renderBackgroundImage(state, opacityStyle, props)
        : renderImage(state, opacityStyle, props)}
    </span>
  )
}

export default LazyImg
