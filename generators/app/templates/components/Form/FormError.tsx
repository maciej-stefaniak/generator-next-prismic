import React from 'react'

const FormError = ({
  formError,
  singleErrors,
  error_message,
  visible = false
}) =>
  ((formError && formError.length > 0) || singleErrors.length > 0) &&
  visible ? (
    <div className="Form-error">
      <p className="copy-small">
        {error_message}
        <span className="Form-error-single-wrapper">
          {formError && formError.length > 0 ? (
            formError
          ) : (
            <span className="Form-error-single-errors">
              {singleErrors.map(singleError => (
                <span>{`- ${singleError}`}</span>
              ))}
            </span>
          )}
        </span>
      </p>
    </div>
  ) : null

export default FormError
