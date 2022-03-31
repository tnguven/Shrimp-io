import { ShortUrlDb } from '@data-access';
import { omit } from 'ramda';

export function makeGetShortUrls({ shortUrlDb }: { shortUrlDb: ShortUrlDb }) {
  return async function getShortUrls({
    limit,
    lastId,
    sessionToken,
  }: {
    limit: number;
    sessionToken: string;
    lastId?: string;
  }) {
    const list = await shortUrlDb.findAll({ limit, lastId, sessionToken });
    return list.map((item) => omit(['sessionToken'], item));
  };
}
