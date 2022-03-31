import httpStatus from 'http-status';
import { IncreaseShortUrlClick } from '@use-cases';
import { RequestObj, EmptyObj } from 'types';

export function makeRedirectShortUrl({
  increaseShortUrlClick,
}: {
  increaseShortUrlClick: IncreaseShortUrlClick;
}) {
  return async function redirectShortUrl({
    params,
  }: RequestObj<EmptyObj, EmptyObj, EmptyObj, { urlCode: string }>) {
    const { urlCode } = params;
    try {
      const redirectUrl = await increaseShortUrlClick(urlCode);
      return {
        headers: { 'content-type': 'application/json' },
        statusCode: redirectUrl ? httpStatus.FOUND : httpStatus.NOT_FOUND,
        redirect: redirectUrl || `/404`,
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
