import { ReactNode } from 'react';
import styles from './EmptyField.module.css';

interface Props {
  children: ReactNode;
}

export function EmptyField({ children }: Props) {
  return <div className={styles.container}>{children}</div>;
}

export const EmptyUrlList = ({ text }: { text: string }) => (
  <EmptyField>
    <img className={styles.folderIcon} src="/static/empty-button.png" alt={'empty folder icon'} />
    {text}
  </EmptyField>
);
