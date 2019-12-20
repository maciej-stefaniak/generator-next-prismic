import React from 'react'

import InputStyled from './InputStyled'

const Checkbox = ({
  register,
  name,
  label,
  type = 'checkbox',
  animLabel = false,
  ...rest
}) => {
  return (
    <InputStyled
      label={label}
      name={name}
      animLabel={animLabel}
      className="CheckboxStyled"
      error={rest.error}
      inputElement={
        <input name={name} id={name} ref={register} type="checkbox" {...rest} />
      }
    />
  )
}

export default Checkbox
