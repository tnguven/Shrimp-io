import React from 'react';
import { ShortUrlForm } from './ShortUrlForm';

import styles from './ShortUrlFormColumn.module.css';

export function ShortUrlFormColumn() {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src="/static/shrimp.logo.png" alt="Shrimp logo" />
      </div>
      <h1>Shorten links on your domain</h1>
      <p>Shorten and share short URLs</p>
      <h2 className={styles.primaryColor}>
        Start from here{' '}
        <img className={styles.arrowIcon} src="/static/arrow.png" alt="Start here arrow icon" />
      </h2>

      <ShortUrlForm />
    </div>
  );
}
