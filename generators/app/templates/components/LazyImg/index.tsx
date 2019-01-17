import * as React from 'react'
import './styles.scss'

import { isIE, isNode, isRetina, w } from '../../utils'

const loadingImg =
  'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

interface ILazyImgProps {
  src: string
  srcRetina?: string
  className?: string
  children?: React.ReactNode | React.ReactNode[]
  isBackground?: boolean
  allowWebp?: boolean
  backgroundColor?: string
  elId?: string
  alt?: string
  timeout?: number
  onLoad?: (error?: boolean) => void
  onClick?: () => void
  spaceHolderFix?: number
  manuallyLoaded?: boolean
  inlineSvg?: boolean
  inlineSvgFallback?: string
}

interface ILazyImgState {
  status: 'loading' | 'loaded' | 'failed'
  retina: boolean
  supportsWebp: boolean
  src?: string | null | undefined
  svgInlineCode?: string
}

class LazyImg extends React.Component<ILazyImgProps, ILazyImgState> {
  private imageRef: any
  private mounted: boolean = false
  private mountedIE: boolean = false
  private loadTimeout: number

  constructor(props: ILazyImgProps) {
    super(props)
    this.state = {
      status: 'loading',
      retina: false,
      supportsWebp: false,
      src: null
    }

    this.imageRef = React.createRef()
  }

  componentWillMount() {
    this.setState(
      {
        retina: isRetina(),
        supportsWebp: this.supportsWebp()
      },
      () => {
        if (w.requestIdleCallback) {
          w.requestIdleCallback(this.reload)
        } else {
          this.reload()
        }
      }
    )
  }
  componentDidMount() {
    if (!isNode && isIE()) {
      this.mountedIE = true
    }
    this.mounted = true
  }

  componentDidUpdate(prevProps, prevState) {
    const { src, srcRetina } = this.props

    if (prevProps.src !== src || prevProps.srcRetina !== srcRetina) {
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

  loadInlineSvg = (src: string, srcFallback?: string) => {
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

  handleImageErrored = (err: any): any => {
    const { onLoad } = this.props
    console.error('e: ', err, this.state.src)
    clearTimeout(this.loadTimeout)
    if (this.mounted) {
      this.setState({ status: 'failed' }, () => {
        if (onLoad) {
          onLoad(true)
        }
      })
    }
  }

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

        {spaceHolderFix && (
          <span
            style={{
              position: 'relative',
              width: '100%',
              paddingTop: `${spaceHolderFix}%`,
              display: 'block'
            }}
          />
        )}

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
    )
  }

  getEl = () => this.imageRef.current

  render() {
    const { className, isBackground, backgroundColor } = this.props

    const style = {
      opacity: this.state.status === 'loaded' || isNode ? 1 : 0
    }

    let el
    if (isBackground) {
      el = this.renderBackgroundImage(style)
    } else {
      el = this.renderImage(style)
    }

    return (
      <span
        ref={this.imageRef}
        style={backgroundColor ? { background: backgroundColor } : {}}
        className={`LazyImg ${className || ''}`}
        onClick={this.onClick}
      >

        {el}
      </span>
    )
  }
}

export default LazyImg
