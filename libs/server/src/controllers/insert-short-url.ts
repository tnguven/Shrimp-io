import httpStatus from 'http-status';
import { AddShortUrl } from '@use-cases';
import { RequestObj } from 'global';

export function makeInsertShortUrl({ addShortUrl }: { addShortUrl: AddShortUrl }) {
  return async function makeInsertShortUrl({
    body,
    cookies,
  }: RequestObj<{ url: string }, { token: string }>) {
    const { shortUrl, existingUrl } = await addShortUrl({ url: body.url, token: cookies.token });

    return {
      headers: { 'content-type': 'application/json' },
      statusCode: existingUrl ? httpStatus.FOUND : httpStatus.OK,
      body: { shortUrl },
    };
  };
}
