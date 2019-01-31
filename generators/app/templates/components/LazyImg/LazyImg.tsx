import * as React from 'react'
import classnames from 'classnames'

import './styles.scss'

import { isIE, isNode, isRetina, w } from '../../utils'

const loadingImg =
  'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

export type ILazyImgProps = {
  src: string

  /*
   * Aternative src for retina screens
   */
  srcRetina?: string

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
   * Use webp if supported
   */
  allowWebp?: boolean

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
  onError?: () => void
  onClick?: () => void
}

type ILazyImgState = {
  status: 'loading' | 'loaded' | 'failed'
  retina: boolean
  supportsWebp: boolean
  src?: string | null | undefined
  svgInlineCode?: string
}

class LazyImg extends React.Component<ILazyImgProps, ILazyImgState> {
  private mounted: boolean = false
  private mountedIE: boolean = false
  private loadTimeout: number
  private useObserver: boolean = false

  constructor(props: ILazyImgProps) {
    super(props)

    this.state = {
      status: 'loading',
      retina: isRetina(),
      supportsWebp: this.supportsWebp(),
      src: null
    }
  }

  componentDidMount() {
    if (!isNode && isIE()) {
      this.mountedIE = true
    }
    this.mounted = true
    if (w.requestIdleCallback) {
      w.requestIdleCallback(this.reload)
    } else {
      this.reload()
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.src != this.props.src ||
      prevProps.srcRetina !== this.props.srcRetina
    ) {
      if (w.requestIdleCallback) {
        w.requestIdleCallback(this.reload)
      } else {
        this.reload()
      }
    }
  }

  componentWillUnmount() {
    this.mounted = false
    if (!isNode && isIE()) {
      this.mountedIE = false
    }
  }

  onClick = () => {
    const { onClick } = this.props
    if (onClick) onClick()
  }

  /*
   * Try to loads the svg as inline, to allow animations, style changes and such
   */
  loadInlineSvg = (src: string) => {
    // If SVG is supported
    if (typeof SVGRect !== 'undefined') {
      // Request the SVG file to load it inline
      const ajax = new XMLHttpRequest()
      ajax.open('GET', src, true)
      ajax.onreadystatechange = (e: any) => {
        if (this.mounted && ajax.readyState === 4) {
          if (ajax.status === 200) {
            this.setState(
              {
                svgInlineCode: ajax.responseText
              },
              this.handleImageLoaded
            )
          } else {
            this.setState(
              {
                src: this.props.inlineSvgFallback
              },
              this.handleImageLoaded
            )
            console.log(`Error fetching svg for inline: ${ajax.statusText}`)
          }
        }
      }
      ajax.send()
    } else if (this.mounted) {
      this.setState(
        {
          src: this.props.inlineSvgFallback
        },
        this.handleImageLoaded
      )
    }
  }

  /*
   * Starts/triggers the loading of the image source
   */
  loadImage = () => {
    const { timeout, inlineSvg } = this.props
    const { src } = this.state

    if (inlineSvg) {
      this.loadInlineSvg(src)
    } else {
      const imgElem = document.createElement('img') // new Image()
      imgElem.onload = this.handleImageLoaded
      imgElem.onerror = this.handleImageErrored
      imgElem.src = src

      if (timeout) {
        this.loadTimeout = window.setTimeout(this.handleImageErrored, timeout)
      }

      if (!isNode && isIE()) {
        if (imgElem.complete) {
          this.handleImageLoaded()
        }
      }
    }
  }

  /*
   * Handles the error when the image didn't load properly
   */
  handleImageErrored = (err: any): any => {
    const { onError } = this.props
    console.error('e: ', err, this.state.src)
    clearTimeout(this.loadTimeout)
    if (this.mounted) {
      this.setState({ status: 'failed' }, () => {
        if (onError) {
          onError(true)
        }
      })
    }
  }

  /*
   * Handles the success when the image loads properly
   */
  handleImageLoaded = (): void => {
    if (this.loadTimeout) {
      clearTimeout(this.loadTimeout)
    }

    if (this.mounted || this.mountedIE) {
      this.setState({ status: 'loaded' }, () => {
        if (this.props.onLoad) {
          this.props.onLoad()
        }
      })
    }
  }

  reload = (): void => {
    const { retina, supportsWebp } = this.state
    const { src, srcRetina, allowWebp } = this.props

    if (!src && !srcRetina) return

    let finalSrc = src
    if (retina && srcRetina) {
      finalSrc = srcRetina
    }

    if (supportsWebp && allowWebp) {
      const oldExtension = finalSrc.split('.').pop()
      finalSrc = finalSrc.replace(`.${oldExtension}`, '.webp')
    }

    this.setState({ status: 'loading', src: finalSrc }, () => {
      if (this.props.manuallyLoaded) {
        this.handleImageLoaded()
      } else {
        this.loadImage()
      }
    })
  }

  supportsWebp = (): boolean => {
    if (!isNode) {
      if (w.supportsWebp) {
        return true
      }
      const elem = document.createElement('canvas')
      if (elem.getContext && elem.getContext('2d')) {
        // was able or not to get WebP representation
        if (elem.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
          w.supportsWebp = true
          return true
        }
      }
    }
    return false
  }

  renderBackgroundImage = (style: any): React.ReactNode => {
    const { src, status } = this.state
    const { children, backgroundColor, elId, spaceHolderFix } = this.props

    const bgSrcNotLoaded = isNode ? `url(${this.props.src})` : 'none'

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
            backgroundImage:
              status === 'loaded' ? `url(${src})` : bgSrcNotLoaded
          }}
        >
          {children}
        </div>
      </noscript>
    ) : (
      <div
        id={elId}
        className={`LazyImg-in LazyImg-el LazyImg-bg ${this.state.status}`}
        style={{
          ...s,
          backgroundImage: status === 'loaded' ? `url(${src})` : bgSrcNotLoaded
        }}
      >
        {children}
      </div>
    )
  }

  renderImage = (style: any): React.ReactNode => {
    const { src, status, svgInlineCode } = this.state
    const { elId, alt, spaceHolderFix, inlineSvg } = this.props

    const srcNotLoaded = isNode ? this.props.src : loadingImg

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
              className={`LazyImg-el LazyImg-inline-svg ${status}`}
              style={s}
              dangerouslySetInnerHTML={{ __html: svgInlineCode }}
            />
          ) : !isNode ? (
            <img
              id={elId}
              className={`LazyImg-el ${status}`}
              src={status === 'loaded' ? src : srcNotLoaded}
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

  render() {
    const { className = '', isBackground, backgroundColor } = this.props

    const opacityStyle = {
      opacity: this.state.status === 'loaded' || isNode ? 1 : 0
    }

    let el
    if (isBackground) {
      el = this.renderBackgroundImage(opacityStyle)
    } else {
      el = this.renderImage(opacityStyle)
    }

    return (
      <span
        style={
          backgroundColor
            ? { ...this.props.style, background: backgroundColor }
            : this.props.style
        }
        className={classnames('LazyImg', className)}
        onClick={this.onClick}
      >
        {el}
      </span>
    )
  }
}

export default LazyImg
