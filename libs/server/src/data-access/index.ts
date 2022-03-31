import { Collection, WithId } from 'mongodb';
import { getCollection } from '@db/mongoDb';
import { makeShortUrlDb } from './shortUrlDb';

export const shortUrlDb = makeShortUrlDb({
  getCollection: getCollection,
});

export type ShortUrlCol = Collection<CreatedShortUrl>;

export type ShortUrlDb = typeof shortUrlDb;

export interface CreatedShortUrl {
  id?: string;
  url: string;
  sessionToken: string;
  shortUrl: string;
  urlCode: string;
  createdAt: Date;
  expireAt: Date;
  clicks: number;
}

export type ShortUrlModel = WithId<Omit<CreatedShortUrl, 'id'>>;
