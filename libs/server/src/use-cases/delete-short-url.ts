import { ShortUrlDb } from '@data-access';

export function makeDeleteShortUrl({ shortUrlDb }: { shortUrlDb: ShortUrlDb }) {
  return function deleteShortUrl({ token, id }: { token: string; id?: string }) {
    if (id) return shortUrlDb.removeByIdAndSessionToken({ sessionToken: token, id });
    return shortUrlDb.removeBySessionToken(token);
  };
}
