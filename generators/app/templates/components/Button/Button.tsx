import * as React from 'react'
import './styles.scss'

type OnClick = (event) => void

type IButtonProps = {
  onClick?: OnClick
  className?: string
  type?: 'button' | 'submit' | 'reset'
  children?: React.ReactNode | React.ReactNode[]
}

const Button: React.SFC<IButtonProps> = ({
  onClick,
  type = 'button',
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
    <button type={type} className={`Button ${className}`} onClick={handleClick}>
      <span>{children}</span>
    </button>
  )
}

export default Button
