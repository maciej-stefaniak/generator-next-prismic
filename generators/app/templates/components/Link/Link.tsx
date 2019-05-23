import * as React from 'react'
import Link from 'next/link';
import classnames from 'classnames'
const Routes = require('../../server/routes')
import './styles.scss'

type OnClick = (event) => void

type ILinkProps = {
  type?: 'internal' | 'external' | 'mailto'
  url: string
  prefetch?: boolean
  onClick?: OnClick
  className?: string
  asButton?: boolean
  pageComponent?: string
  children?: React.ReactNode | React.ReactNode[]
}

const InternalComponent = props => {
  const { children, type, className, url, pageComponent, prefetch = false, onClick } = props
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
    if (process.env.EXPORT || !(Routes && Routes.Link)) {
      return (
        <Link as={url} href={{ pathname: pageComponent }} prefetch={prefetch}>
          <a className={className} onClick={onClick}>
            {children}
          </a>
        </Link>
      )
    } else {
      return (
        <Routes.Link route={url} prefetch={prefetch}>
          <a className={className} onClick={onClick}>
            {children}
          </a>
        </Routes.Link>
      )
    }
  }

  if (typeDetected === 'mailto') {
    const mailUrl = (url.indexOf('mailto:') !== -1) ? url : `mailto:${url}`
    return <a href={mailUrl} {...props} />
  }

  return <a href={url} target="_blank" rel="noopener" {...props} />
}

const OurLink: React.SFC<ILinkProps> = ({
  type,
  url,
  onClick,
  children,
  pageComponent = '/main',
  prefetch = false,
  className = '',
  asButton = false
}) => {
  const handleClick: OnClick = e => {
    if (onClick) {
      e.preventDefault()
      onClick(e)
    }
  }

  return (
    <span className={classnames(
      'Link',
      className,
      {
        Button: asButton
      }
    )}>
      <div>
        <InternalComponent type={type} url={url} onClick={handleClick} pageComponent={pageComponent} prefetch={prefetch}>
          <span>{children}</span>
        </InternalComponent>
      </div>
    </span>
  )
}

export default OurLink
