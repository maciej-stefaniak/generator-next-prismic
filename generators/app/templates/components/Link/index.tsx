import * as React from 'react'
const { Link: InternalLink } = require('../../server/routes')
import './styles.scss'

import classnames from 'classnames'

type OnClick = (event) => void

interface ILinkProps {
  type: 'internal' | 'external' | 'mailto'
  url: string
  title: string
  onClick?: OnClick
  className?: string
}

const InternalComponent = props => {
  if (props.type === 'internal') {
    return (
      <InternalLink route={props.url}>
        <a className={props.className} onClick={props.onClick}>
          {props.children}
        </a>
      </InternalLink>
    )
  }

  if (props.type === 'mailto') {
    return <a href={props.url} {...props} />
  }

  return <a href={props.url} target="_blank" rel="noopener" {...props} />
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
          <p>{title}</p>
        </InternalComponent>
      </div>
    </span>
  )
}

export default Link
