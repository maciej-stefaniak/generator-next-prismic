import React, { useState } from 'react'

import Button from '../Button/Button'

const Counter = ({
  register,
  name,
  label,
  number_indicator,
  type = 'text',
  animLabel = false,
  defaultValue = 0,
  ...rest
}) => {
  const [counter, setCounter] = useState(defaultValue)

  return (
    <label className="Counter">
      {label}
      <input
        name={name}
        id={name}
        ref={register}
        type="number"
        readOnly={true}
        {...rest}
        value={counter}
        style={{ display: 'none', visibility: 'hidden' }}
      />
      <span className="Counter-right">
        <span className="Counter-indicator">{number_indicator}</span>
        <Button
          type="button"
          className="Counter-btn Button outline dark Counter-btn-less"
          onClick={() => {
            if (counter >= 1) setCounter(counter - 1)
          }}
        >
          <span>-</span>
        </Button>
        <span className="Counter-number">{counter}</span>
        <Button
          type="button"
          className="Counter-btn Button outline dark Counter-btn-more"
          onClick={() => {
            setCounter(counter + 1)
          }}
        >
          <span>+</span>
        </Button>
      </span>
    </label>
  )
}

export default Counter
