import React from 'react'

import InputStyled from './InputStyled'

const Input = ({
  className = '',
  register,
  name,
  label,
  type = 'text',
  animLabel = false,
  ...rest
}) => {
  return (
    <InputStyled
      className={className}
      label={label}
      name={name}
      animLabel={animLabel}
      error={rest.error}
      inputElement={
        <input name={name} id={name} ref={register} type={type} {...rest} />
      }
    />
  )
}

export default Input
