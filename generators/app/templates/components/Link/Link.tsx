import * as React from 'react'
const { Link: InternalLink } = require('../../server/routes')
import './styles.scss'

type OnClick = (event) => void

type ILinkProps = {
  type?: 'internal' | 'external' | 'mailto'
  url: string
  prefetch?: boolean
  onClick?: OnClick
  className?: string
  children?: React.ReactNode | React.ReactNode[]
}

const InternalComponent = props => {
  const { children, type, className, url, prefetch = false, onClick } = props
  let typeDetected = type || 'internal'

  // `type` not specified - detect it
  if (!type) {
    // mailto
    if (url.match(/mailto:/i) || url.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
      typeDetected = 'mailto'
    }

    // external
    if (url.match(/http(s)?:\/\//i)) typeDetected = 'external'
  }
  
  if (typeDetected === 'internal') {
    return (
      <InternalLink route={url} prefetch={prefetch}>
        <a className={className} onClick={onClick}>
          {children}
        </a>
      </InternalLink>
    )
  }

  if (typeDetected === 'mailto') {
    const mailUrl = (url.indexOf('mailto:') !== -1) ? url : `mailto:${url}`
    return <a href={mailUrl} {...props} />
  }

  return <a href={url} target="_blank" rel="noopener" {...props} />
}

const Link: React.SFC<ILinkProps> = ({
  type,
  url,
  onClick,
  children,
  className = ''
}) => {
  const handleClick: OnClick = e => {
    if (onClick) {
      e.preventDefault()
      onClick(e)
    }
  }

  return (
    <span className={`Link ${className}`}>
      <div>
        <InternalComponent type={type} url={url} onClick={handleClick}>
          <span>{children}</span>
        </InternalComponent>
      </div>
    </span>
  )
}

export default Link
