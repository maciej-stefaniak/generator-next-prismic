import React, { useState } from 'react'
import classnames from 'classnames'
import useForm from 'react-hook-form/dist/react-hook-form.ie11'

import {Checkbox, DatePicker, Input, Radio, FormError, Select, Textarea, ProgressButton } from '../'

import { FORM_EMAIL_API_POINT } from './../../constants'

const STATUS_DEFAULT = 'default'
const STATUS_LOADING = 'loading'
const STATUS_SUCCESS = 'success'
const STATUS_ERROR = 'error'

const DemoForm = (lang) => { 
  const { register, handleSubmit, setValue, triggerValidation, errors = {} } = useForm()
  const [status, setStatus] = useState(STATUS_DEFAULT)
  const [formError, setFormError] = useState(null)
  const [isSubmitted, setSubmitted] = useState(false)

  let singleErrors = [
    ...(errors['name_email_input'] ? ['E-mail error message'] : []),
    ...(errors['name_textarea'] ? ['Textarea error message'] : []),
    ...(errors['name_checkbox'] ? ['Checkbox error message'] : []),
    ...(errors['name_select'] ? ['Select error message'] : []),
    ...(errors['name_datepicker'] ? ['Datepicker error message'] : [])
  ]

  const onSubmit = async data => {
    console.log('onSubmit')
    const onEnd = (
      res: any,
      success: boolean,
      responseError: string = null
    ) => {
      window.setTimeout(() => {
        if (!!responseError || res.status !== 200) {
          console.log('error', responseError)
          setFormError(responseError)
          setStatus(STATUS_ERROR)
        } else {
          setStatus(STATUS_SUCCESS)
        }
      }, 1200)
    }

    setStatus(STATUS_LOADING)

    try {
      const res = await fetch(FORM_EMAIL_API_POINT, {
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
      onEnd(res, true)
    } catch (e) {
      onEnd(null, false, e)
    }
  }

  return (<div className="generator-demo-form">
    <form
      className={classnames({ submitted: isSubmitted })}
      onSubmit={handleSubmit(onSubmit)}
      onChange={() => {
        triggerValidation()
        setStatus(STATUS_DEFAULT)
      }}
    >
      <Input
        name="name_email_input"
        type="email"
        animLabel
        label="E-mail label"
        placeholder='E-mail placeholder'
        required
        register={register({
          required: true,
          pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        })}
        error={
          isSubmitted && errors['name_email_input']
            ? 'E-mail error message'
            : null
        }
      />

      <Textarea
        name="name_textarea"
        label="Textarea label"
        animLabel
        placeholder="Textarea placeholder"
        required
        register={register({ required: true })}
        error={
          isSubmitted && errors['name_textarea']
            ? 'Textarea error message'
            : null
        }
      />

      <Checkbox
        name="name_checkbox"
        label="Checkbox label"
        required
        defaultChecked={false}
        register={register({ required: true })}
      />

      <div>
        <Radio 
          name="name_radio" 
          id="radio1" 
          label="Radio 1 label" 
          register={register} 
        />
        <Radio 
          name="name_radio" 
          id="radio2" 
          label="Radio 2 label" 
          defaultChecked 
          register={register} 
        />
      </div>
      
      <Select
        label="Select label"
        name="name_select"
        placeholder="Select placeholder"
        required
        options={[{name: 'Option 1', value: 1}, {name: 'Option 2', value: 2}]}
        register={register({ required: true })}
        error={
          isSubmitted && errors['name_select']
            ? 'Select error message'
            : null
        }
      />

      <DatePicker
        label="Datepicker label"
        name="name_datepicker"
        placeholder="Datepicker placeholder"
        required
        register={register({ required: true })}
        setValue={setValue}
        lang={lang}
        error={
          isSubmitted && errors['name_datepicker']
            ? 'Datepicker error message'
            : null
        }
      />

      <FormError
        visible={isSubmitted}
        singleErrors={singleErrors}
        formError={formError}
        error_message="Form errors:"
      />

      <ProgressButton
        onClick={e => {
          triggerValidation()
          setSubmitted(true)
        }}
        status={status}
        enabled={!formError}
        type="submit"
      >Submit ProgressButton</ProgressButton>
      
    </form>
  </div>)
}
    
export default DemoForm