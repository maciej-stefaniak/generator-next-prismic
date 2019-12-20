import React from 'react'

import { ArrowDown } from '../InlineIcons'
import InputStyled from './InputStyled'

type ISelectProps = {
  register?: any
  options: any[]
  name: string
  label?: string
  placeholder?: string
  required?: boolean
  error?: string
  onChange?: (event: React.FormEvent<HTMLSelectElement>) => any
}

const Select = ({
  register,
  options,
  name,
  label,
  placeholder,
  required = false,
  ...rest
}: ISelectProps) => {
  return (
    <InputStyled
      label={label}
      name={name}
      error={rest.error}
      inputElement={
        <>
          <select name={name} ref={register} required={required} {...rest}>
            <option value="" hidden={!!required}>
              {placeholder}
            </option>
            {options.map(value => {
              let n, v
              if (typeof value === 'object') {
                v = value.value
                n = value.name
              } else {
                v = value
                n = value
              }
              return (
                <option value={v} key={v}>
                  {n}
                </option>
              )
            })}
          </select>
          <span className="input-icon select-arrow">
            <ArrowDown />
          </span>
        </>
      }
    />
  )
}

export default Select
