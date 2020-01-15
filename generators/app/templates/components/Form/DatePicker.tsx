import React, { useState, useEffect } from 'react'
import DayPickerInput from 'react-day-picker/DayPickerInput'

import InputStyled from './InputStyled'

import { Calendar } from '../InlineIcons'

import { CALENDAR_LOCALE } from './../../constants'

export const parseDate = str => {
  if (
    !str ||
    str.length < 10 ||
    Object.prototype.toString.call(str) === '[object Date]'
  )
    return new Date(str)
  const d = new Date()
  const day = str.split('.')[0]
  const month = str.split('.')[1]
  const year = str.split('.')[2]
  d.setDate(parseInt(day))
  d.setMonth(parseInt(month) - 1)
  d.setFullYear(parseInt(year))
  return d
}

export const formatDate = (date, format, locale) => {
  if (!date) return null
  return `${('0' + date.getDate()).slice(-2)}.${(
    '0' +
    (date.getMonth() + 1)
  ).slice(-2)}.${date.getFullYear()}`
}

const DatePicker = ({
  register,
  name,
  label,
  required = false,
  setValue,
  minDate = null,
  lang,
  ...rest
}) => {
  const [dateL, setDateL] = useState()

  const datePickerLocalization =
    CALENDAR_LOCALE && CALENDAR_LOCALE[lang]
      ? {
          locale: lang,
          months: CALENDAR_LOCALE[lang].months,
          weekdaysLong: CALENDAR_LOCALE[lang].weekdaysLong,
          weekdaysShort: CALENDAR_LOCALE[lang].weekdaysShort,
          firstDayOfWeek: 0
        }
      : {}

  useEffect(
    () => {
      if (minDate) {
        const minDateO =
          minDate.length <= 10 ? parseDate(minDate) : new Date(minDate)
        if (minDateO && minDateO > dateL) {
          setDateL(minDateO)
        }
      }
    },
    [minDate]
  )

  return (
    <InputStyled
      label={label}
      name={name}
      error={rest.error}
      inputElement={
        <>
          <DayPickerInput
            format="D.M.YYYY"
            parseDate={parseDate}
            formatDate={formatDate}
            inputProps={{
              id: `DatePicker-${name}`,
              ref: register,
              name: name,
              required: required,
              autoComplete: 'off',
              ...rest
            }}
            {...(rest.value || dateL
              ? { value: dateL ? dateL : parseDate(rest.value) }
              : {})}
            onDayChange={val => {
              if (setValue) {
                setValue(name, val)
              }
              setDateL(val)
            }}
            dayPickerProps={
              minDate
                ? {
                    disabledDays: {
                      before:
                        minDate.length <= 10
                          ? parseDate(minDate)
                          : new Date(minDate)
                    },
                    month:
                      minDate.length <= 10
                        ? parseDate(minDate)
                        : new Date(minDate),
                    ...datePickerLocalization
                  }
                : { ...datePickerLocalization }
            }
          />
          <span className="input-icon calendar-icon">
            <Calendar />
          </span>
        </>
      }
    />
  )
}

export default DatePicker
