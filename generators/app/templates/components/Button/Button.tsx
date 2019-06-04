import * as React from 'react'
import './styles.scss'

type OnClick = (event) => void

type IButtonProps = {
  onClick?: OnClick
  className?: string
  children?: React.ReactNode | React.ReactNode[]
}

const Button: React.SFC<IButtonProps> = ({
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
    <button className={`Button ${className}`} onClick={handleClick}>
      <span>{children}</span>
    </button>
  )
}

export default Button
