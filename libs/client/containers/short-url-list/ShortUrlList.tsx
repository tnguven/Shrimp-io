import { useState, useEffect, useCallback, useMemo } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';
import { useUrlListState, useDispatchUrlList } from '@/state/urlList.context';
import { makeGetShortUrls, makeDeleteUrl } from '@/state/urlList.actions';
import { ShortUrl } from '@/state/types';

import { TextButton } from '@/components/buttons/TextButton';
import { BaseButton } from '@/components/buttons/BaseButton';
import { EmptyUrlList } from '@/components/empty-field/EmptyField';

import styles from './ShortUrlList.module.css';

export const createdAtTimeFormat = (d: Date) => {
  const minutes = (Date.now() - d.getTime()) / 1000 / 60;
  if (minutes <= 60) return `${Math.abs(Math.round(minutes))} min ago`;

  const hours = minutes / 60;
  if (hours <= 24) return `${Math.abs(Math.round(hours))} hours ago`;

  const days = hours / 24;
  return `${Math.abs(Math.round(days))} days ago`;
};

export const ListItem = ({
  shortUrl,
  url,
  createdAt,
  id,
  clicks,
  deleteUrl,
  deleting,
  urlCode,
}: ShortUrl & { deleteUrl: (id: string) => Promise<void>; deleting: boolean }) => {
  const [confirmation, setConfirmation] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const id = setTimeout(() => setCopied(false), 1000);
      return () => clearTimeout(id);
    }
  }, [copied]);

  const handleConfirmDelete = () => {
    setConfirmation(!confirmation);
  };

  const handleDelete = async () => {
    void (await deleteUrl(id));
    setConfirmation(false);
  };

  return (
    <li className={styles.listItem}>
      <div className={styles.header}>
        <div className={styles.shortUrlCol}>
          <p className={styles.shortUrlBlock}>
            <a href={shortUrl}>
              {shortUrl}{' '}
              <img
                data-testid={`link-${urlCode}`}
                className={styles.linkIcon}
                src="/static/external-link-grey.png"
                alt={`${shortUrl} link anchor icon`}
              />
            </a>
          </p>
          <p className={styles.metaDataBlock}>
            {createdAtTimeFormat(new Date(createdAt))} | clicks {clicks}
          </p>
        </div>
        <div className={styles.copyCol}>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          {confirmation && <TextButton onClick={handleDelete}>Confirm</TextButton>}
          <TextButton onClick={handleConfirmDelete}>
            {confirmation ? 'Cancel' : deleting ? 'Deleting...' : 'Delete'}
          </TextButton>
          <CopyToClipboard text={shortUrl} onCopy={() => setCopied(true)}>
            <BaseButton>
              <img className={styles.copyIcon} src="/static/copy-icon.png" alt="Copy icon" />
              {copied ? 'Copied' : 'Copy'}
            </BaseButton>
          </CopyToClipboard>
        </div>
      </div>
      <div className={styles.footer}>
        <p>{url}</p>
      </div>
    </li>
  );
};

export function ShortUrlList() {
  const dispatch = useDispatchUrlList();
  const { getUrls, deleteUrl } = useMemo(
    () => ({
      getUrls: makeGetShortUrls(dispatch),
      deleteUrl: makeDeleteUrl(dispatch),
    }),
    [dispatch]
  );
  const { data, deleting, error } = useUrlListState();

  useEffect(() => {
    void getUrls({ limit: 10 });
  }, [getUrls]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return (
    <>
      {data?.length > 0 ? (
        <ul className={styles.list} data-test-id="url-link-list">
          {data.map((props) => (
            <ListItem
              key={props.id}
              {...props}
              deleting={!!deleting.find((id) => id === props.id || id === 'all')}
              deleteUrl={deleteUrl}
            />
          ))}
        </ul>
      ) : (
        <EmptyUrlList text="No recent URLs in your history" />
      )}
    </>
  );
}
