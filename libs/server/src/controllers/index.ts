import { getShortUrls, addShortUrl, increaseShortUrlClick, deleteShortUrl } from '@use-cases';
import { makeGetShortenedUrls } from './listUrls';
import { makeInsertShortUrl } from './insertShortUrl';
import { makeRedirectShortUrl } from './redirectShortUrl';
import { makeRemoveUrl } from './removeUrl';

export const getShortenedUrls = makeGetShortenedUrls({
  getShortUrls,
});
export const insertShortUrl = makeInsertShortUrl({ addShortUrl });
export const redirectShortUrl = makeRedirectShortUrl({
  increaseShortUrlClick,
});
export const removeUrl = makeRemoveUrl({ deleteShortUrl });
