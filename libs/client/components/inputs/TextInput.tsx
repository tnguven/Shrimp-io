import React, { InputHTMLAttributes, forwardRef } from 'react';
import styles from 'components/inputs/TextInput.module.css';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
  label?: string;
}

export default forwardRef<HTMLInputElement, Props>(function TextInput(
  { label, errorMessage, id, type = 'text', ...rest },
  ref
) {
  return (
    <>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        className={`${styles.input} ${errorMessage ? styles.hasError : ''}`}
        {...rest}
      />
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}
    </>
  );
});
