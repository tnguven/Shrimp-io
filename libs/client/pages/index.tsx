import { Layout } from '@/components/layout/Layout';
import { ShortUrlFormColumn } from '@/containers/short-url-form/ShortUrlFormColumn';
import { ShortUrlListColumn } from '@/containers/short-url-list/ShortUrlListColumn';

import styles from './index.module.css';

export default function IndexPage() {
  return (
    <Layout title="Home | Shrimp url">
      <div className={`${styles.col} ${styles.inputCol}`}>
        <ShortUrlFormColumn />
      </div>
      <div className={`${styles.col} ${styles.urlListCol}`}>
        <ShortUrlListColumn />
      </div>
    </Layout>
  );
}
