import React, { useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { useDispatchUrlList, useUrlListState } from '@/state/urlList.context';
import { makeDeleteAllUrls } from '@/state/urlList.actions';
import { ShortUrlList } from './ShortUrlList';
import { TextButton } from '@/components/buttons/TextButton';

import styles from './ShortUrlListColumn.module.css';

export function ShortUrlListColumn() {
  const dispatch = useDispatchUrlList();
  const { data } = useUrlListState();
  const deleteAllUrls = useCallback(makeDeleteAllUrls(dispatch), [dispatch]);
  const toggleToaster = useRef(false);

  const handleClearConfirmation = () => {
    if (!toggleToaster.current) {
      toggleToaster.current = true;
      const dismissedWithToggle = (id: string) => {
        toggleToaster.current = false;
        return () => toast.dismiss(id);
      };
      toast(
        (t) => (
          <span>
            Are you sure ? <TextButton onClick={dismissedWithToggle(t.id)}>No</TextButton>
            <TextButton
              onClick={() => {
                dismissedWithToggle(t.id);
                void deleteAllUrls();
              }}
            >
              Yes
            </TextButton>
          </span>
        ),
        { duration: 6000 }
      );
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Your short links history</h1>
        {data.length > 0 ? (
          <TextButton onClick={handleClearConfirmation}>Clear all</TextButton>
        ) : null}
      </header>
      <ShortUrlList />
    </div>
  );
}
