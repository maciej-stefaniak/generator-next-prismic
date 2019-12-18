import React from 'react'
import classnames from 'classnames'
import { Button } from '..'

import './styles.scss'

type OnClick = (event) => void

type IProgressButtonProps = {
  onClick?: OnClick
  className?: string
  status?: string
  children?: React.ReactNode | React.ReactNode[]
  enabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const ProgressButton: React.SFC<IProgressButtonProps> = ({
  className = '',
  onClick = () => true,
  status,
  children,
  enabled = true,
  type = 'button'
}) => (
  <div className="ProgressButton-wrapper" onClick={onClick}>
    <Button
      className={classnames([
        'ProgressButton',
        className,
        status,
        { disable: !enabled }
      ])}
      type={type}
    >
      <>
        <span className="button-state normal">
          <span>{children}</span>
        </span>
        <span className="button-state loading">
          <svg className="circular" viewBox="25 25 50 50">
            <circle
              className="path"
              cx="50"
              cy="50"
              r="20"
              fill="none"
              strokeWidth="3"
              strokeMiterlimit="10"
            />
          </svg>
        </span>
        <span className="button-state success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={21}
            height={18}
            viewBox="0 0 23 20"
          >
            <path
              stroke="#ffffff"
              strokeWidth={2}
              d="M3.444 10.24l3.334 3.89L18.794 2.112"
              fill="none"
              fillRule="evenodd"
            />
          </svg>
        </span>
        <span className="button-state error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 357 357"
            width={14}
            height={14}
          >
            <path
              fill="#ffffff"
              d="M357 35.7L321.3 0 178.5 142.8 35.7 0 0 35.7l142.8 142.8L0 321.3 35.7 357l142.8-142.8L321.3 357l35.7-35.7-142.8-142.8z"
            />
          </svg>
        </span>
      </>
    </Button>
  </div>
)

export default ProgressButton
