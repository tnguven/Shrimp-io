import httpStatus from 'http-status';
import { AddShortUrl } from '@use-cases';
import { RequestObj } from 'types';

export function makeInsertShortUrl({ addShortUrl }: { addShortUrl: AddShortUrl }) {
  return async function makeInsertShortUrl({
    body,
    cookies,
  }: RequestObj<{ url: string }, { token: string }>) {
    try {
      const { shortUrl, existingUrl } = await addShortUrl({ url: body.url, token: cookies.token });
      return {
        headers: { 'content-type': 'application/json' },
        statusCode: existingUrl ? httpStatus.FOUND : httpStatus.OK,
        body: { shortUrl },
      };
    } catch (err) {
      return {
        headers: { 'content-type': 'application/json' },
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        body: {
          error: err instanceof Error ? err.message : 'something went wrong',
        },
      };
    }
  };
}
