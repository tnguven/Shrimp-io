import { ButtonHTMLAttributes, ReactChild } from 'react';
import { BaseButton } from './BaseButton';
import styles from 'components/buttons/TextButton.module.css';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactChild;
}

export function TextButton({ children, onClick, ...rest }: Props) {
  return (
    <BaseButton {...rest} extendStyle={styles.button} onClick={onClick}>
      {children}
    </BaseButton>
  );
}
