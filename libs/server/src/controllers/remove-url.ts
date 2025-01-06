import httpStatus from 'http-status';
import { DeleteShortUrl } from '@use-cases';
import { RequestObj } from 'global';

export function makeRemoveUrl({ deleteShortUrl }: { deleteShortUrl: DeleteShortUrl }) {
  return async function removeUrl({
    body,
    cookies,
  }: RequestObj<{ cleanAll?: boolean; id?: string }, { token: string }>) {
    const cleanAll = body.cleanAll === true;

    await deleteShortUrl({ token: cookies.token, ...(!cleanAll && { id: body.id }) });
    return {
      headers: { 'content-type': 'application/json' },
      statusCode: httpStatus.NO_CONTENT,
    };
  };
}
