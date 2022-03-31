import { ButtonHTMLAttributes } from 'react';
import styles from './BaseButton.module.css';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  extendStyle?: string;
}

export function BaseButton({ children, extendStyle = '', ...rest }: Props) {
  return (
    <button {...rest} className={`${styles.button} ${extendStyle}`}>
      {children}
    </button>
  );
}
