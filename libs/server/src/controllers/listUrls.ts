import httpStatus from 'http-status';
import { GetShortUrls } from '@use-cases';
import { RequestObj, EmptyObj } from 'types';

export function makeGetShortenedUrls({ getShortUrls }: { getShortUrls: GetShortUrls }) {
  return async function getShortenedUrls({
    query,
    cookies,
  }: RequestObj<EmptyObj, { token: string }, { limit?: string; lastId?: string }>) {
    try {
      const limit = query.limit ? parseInt(query.limit) : 10;
      return {
        headers: {
          'content-type': 'application/json',
        },
        statusCode: httpStatus.OK,
        body: {
          shortUrls: await getShortUrls({
            limit,
            lastId: query.lastId,
            sessionToken: cookies.token,
          }),
        },
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
