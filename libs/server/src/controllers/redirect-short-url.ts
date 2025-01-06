import httpStatus from 'http-status';
import { IncreaseShortUrlClick } from '@use-cases';
import { RequestObj, EmptyObj } from 'global';

export function makeRedirectShortUrl({
  increaseShortUrlClick,
}: {
  increaseShortUrlClick: IncreaseShortUrlClick;
}) {
  return async function redirectShortUrl({
    params,
  }: RequestObj<EmptyObj, EmptyObj, EmptyObj, { urlCode: string }>) {
    const { urlCode } = params;
    const redirectUrl = await increaseShortUrlClick(urlCode);

    return {
      headers: { 'content-type': 'application/json' },
      statusCode: redirectUrl ? httpStatus.FOUND : httpStatus.NOT_FOUND,
      redirect: redirectUrl || `/404`,
    };
  };
}
