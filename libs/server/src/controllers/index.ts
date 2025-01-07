import { getShortUrls, addShortUrl, increaseShortUrlClick, deleteShortUrl } from '@use-cases';
import { makeGetShortenedUrls } from './list-urls';
import { makeInsertShortUrl } from './insert-short-url';
import { makeRedirectShortUrl } from './redirect-short-url';
import { makeRemoveUrl } from './remove-url';

export const getShortenedUrls = makeGetShortenedUrls({
  getShortUrls,
});
export const insertShortUrl = makeInsertShortUrl({ addShortUrl });
export const redirectShortUrl = makeRedirectShortUrl({
  increaseShortUrlClick,
});
export const removeUrl = makeRemoveUrl({ deleteShortUrl });
