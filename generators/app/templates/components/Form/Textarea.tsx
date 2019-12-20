import React from 'react'

import InputStyled from './InputStyled'

const Textarea = ({
  register,
  name,
  label,
  animLabel = false,
  error,
  ...rest
}) => {
  return (
    <InputStyled
      label={label}
      name={name}
      animLabel={animLabel}
      error={error}
      inputElement={<textarea name={name} id={name} ref={register} {...rest} />}
    />
  )
}

export default Textarea
