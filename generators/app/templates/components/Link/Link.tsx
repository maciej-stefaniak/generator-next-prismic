import * as React from 'react'
const { Link: InternalLink } = require('../../server/routes')
import './styles.scss'

type OnClick = (event) => void

type ILinkProps = {
  type: 'internal' | 'external' | 'mailto'
  url: string
  title: string
  prefetch?: boolean
  onClick?: OnClick
  className?: string
}

const InternalComponent = props => {
  const { children, type, className, url, prefetch = false, onClick } = props
  if (type === 'internal') {
    return (
      <InternalLink route={url} prefetch={prefetch}>
        <a className={className} onClick={onClick}>
          {children}
        </a>
      </InternalLink>
    )
  }

  if (type === 'mailto') {
    return <a href={url} {...props} />
  }

  return <a href={url} target="_blank" rel="noopener" {...props} />
}

const Link: React.SFC<ILinkProps> = ({
  type,
  url,
  title,
  onClick,
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
          <span>{title}</span>
        </InternalComponent>
      </div>
    </span>
  )
}

export default Link
