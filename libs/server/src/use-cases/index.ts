import { shortUrlDb } from '@data-access';

import { makeAddShortUrl } from './addShortUrl';
import { makeGetShortUrls } from './listShortUrls';
import { makeIncreaseShortUrlClick } from './increasShortUrlClick';
import { makeDeleteShortUrl } from './deleteShortUrl';

export const addShortUrl = makeAddShortUrl({ shortUrlDb });
export const deleteShortUrl = makeDeleteShortUrl({ shortUrlDb });
export const getShortUrls = makeGetShortUrls({ shortUrlDb });
export const increaseShortUrlClick = makeIncreaseShortUrlClick({ shortUrlDb });

export type AddShortUrl = typeof addShortUrl;
export type DeleteShortUrl = typeof deleteShortUrl;
export type GetShortUrls = typeof getShortUrls;
export type IncreaseShortUrlClick = typeof increaseShortUrlClick;
