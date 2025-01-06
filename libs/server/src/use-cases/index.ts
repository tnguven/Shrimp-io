import { shortUrlDb } from '@data-access';

import { makeAddShortUrl } from './add-short-url';
import { makeGetShortUrls } from './list-short-urls';
import { makeIncreaseShortUrlClick } from './increase-short-url-click';
import { makeDeleteShortUrl } from './delete-short-url';

export const addShortUrl = makeAddShortUrl({ shortUrlDb });
export const deleteShortUrl = makeDeleteShortUrl({ shortUrlDb });
export const getShortUrls = makeGetShortUrls({ shortUrlDb });
export const increaseShortUrlClick = makeIncreaseShortUrlClick({ shortUrlDb });

export type AddShortUrl = typeof addShortUrl;
export type DeleteShortUrl = typeof deleteShortUrl;
export type GetShortUrls = typeof getShortUrls;
export type IncreaseShortUrlClick = typeof increaseShortUrlClick;
