import { ShortUrl } from './types';

export type Store = {
  history: ShortUrl[] | undefined;
};

export function loadPersistByKey(key: keyof Store) {
  let res = {} as Store;

  try {
    const data: string | null = localStorage.getItem(key);
    if (data) res = JSON.parse(data) as Store;
  } catch {
    // ignore error
  }
  return res.history;
}

export function saveHistory({ history }: Store) {
  try {
    localStorage.setItem('history', JSON.stringify({ history }));
  } catch {
    // ignore error
  }
}
