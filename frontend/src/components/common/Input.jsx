/**
 * Input Component
 * 
 * Reusable form input with label and error handling.
 */

import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onBlur,
  error = '',
  helperText = '',
  required = false,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  const inputId = `input-${name}`;
  const hasError = Boolean(error);

  return (
    <div className={`form-group ${hasError ? 'has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`form-input ${hasError ? 'input-error' : ''}`}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${inputId}-error` : undefined}
        {...props}
      />
      
      {hasError && (
        <p id={`${inputId}-error`} className="form-error">
          {error}
        </p>
      )}
      
      {!hasError && helperText && (
        <p className="form-helper">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
