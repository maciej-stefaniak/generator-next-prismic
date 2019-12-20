import React from 'react'

import InputStyled from './InputStyled'

const Radio = ({
  register,
  name,
  label,
  id = '',
  type = 'radio',
  animLabel = false,
  ...rest
}) => {
  return (
    <InputStyled
      label={label}
      labelFor={id}
      name={name}
      animLabel={animLabel}
      className="RadioStyled"
      error={rest.error}
      inputElement={
        <input
          name={name}
          id={id ? id : name}
          ref={register}
          type="radio"
          {...rest}
        />
      }
    />
  )
}

export default Radio
