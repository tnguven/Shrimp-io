import { ButtonHTMLAttributes, ReactChild } from 'react';
import { BaseButton } from './BaseButton';
import styles from 'components/buttons/ButtonWithSpinner.module.css';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactChild;
  onClick?: () => void;
  isLoading?: boolean;
}

export function ButtonWithSpinner({ children, onClick, isLoading, ...rest }: Props) {
  return (
    <BaseButton {...rest} extendStyle={styles.button} onClick={onClick}>
      {children}
      {isLoading ? (
        <img className={styles.spinner} src="/static/spinner.png" alt="Loading spinner" />
      ) : null}
    </BaseButton>
  );
}
