import httpStatus from 'http-status';
import { GetShortUrls } from '@use-cases';
import { RequestObj, EmptyObj } from 'global';

export function makeGetShortenedUrls({ getShortUrls }: { getShortUrls: GetShortUrls }) {
  return async function getShortenedUrls({
    query,
    cookies,
  }: RequestObj<EmptyObj, { token: string }, { limit?: string; lastId?: string }>) {
    const limit = query.limit ? parseInt(query.limit) : 10;
    const shortUrls = await getShortUrls({
      limit,
      lastId: query.lastId,
      sessionToken: cookies.token,
    });

    return {
      headers: {
        'content-type': 'application/json',
      },
      statusCode: httpStatus.OK,
      body: {
        shortUrls,
      },
    };
  };
}
