import React, { ReactNode } from 'react';
import Head from 'next/head';

import styles from './Layout.module.css';

type Props = {
  children: ReactNode;
  title: string;
};

export const Layout = ({ children, title }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    </Head>
    <section className={styles.container}>{children}</section>
  </div>
);
