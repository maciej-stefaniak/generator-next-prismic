import React from 'react'
import classnames from 'classnames'
import './styles.scss'

type IInputStyledProps = {
  label: string
  labelFor?: string
  name: string
  inputElement: any
  className?: string
  animLabel?: boolean
  error?: any
}

const InputStyled = ({
  label,
  labelFor = '',
  name,
  animLabel = false,
  className = '',
  inputElement,
  error
}: IInputStyledProps) => {
  return (
    <div
      className={classnames([
        'InputStyled',
        className,
        { 'with-anim': animLabel },
        { 'with-error': !!error }
      ])}
    >
      {inputElement}
      <label htmlFor={labelFor ? labelFor : name}>
        {error ? error : label}
      </label>
    </div>
  )
}

export default InputStyled
