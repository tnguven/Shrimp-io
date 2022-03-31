import httpStatus from 'http-status';
import { DeleteShortUrl } from '@use-cases';
import { RequestObj } from 'types';

export function makeRemoveUrl({ deleteShortUrl }: { deleteShortUrl: DeleteShortUrl }) {
  return async function removeUrl({
    body,
    cookies,
  }: RequestObj<{ cleanAll?: boolean; id?: string }, { token: string }>) {
    const cleanAll = body.cleanAll === true;
    try {
      await deleteShortUrl({ token: cookies.token, ...(!cleanAll && { id: body.id }) });
      return {
        headers: { 'content-type': 'application/json' },
        statusCode: httpStatus.NO_CONTENT,
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
