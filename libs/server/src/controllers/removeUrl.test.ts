import { RequestObj } from 'types';
import { makeRemoveUrl } from './removeUrl';

const mockDeleteShortUrl = jest.fn();

describe('CONTROLLER: removeUrl', () => {
  let removeUrl: ReturnType<typeof makeRemoveUrl>;
  const req = {
    body: { cleanAll: undefined, id: 'testId' },
    cookies: { token: 'token' },
  } as RequestObj<{ cleanAll?: boolean; id?: string }, { token: string }>;

  beforeAll(() => {
    removeUrl = makeRemoveUrl({ deleteShortUrl: mockDeleteShortUrl });
  });

  afterEach(() => {
    mockDeleteShortUrl.mockReset();
  });

  it('should return with status 204 no content', async () => {
    mockDeleteShortUrl.mockResolvedValueOnce(1);
    const result = await removeUrl(req);
    expect(result).toEqual({
      headers: { 'content-type': 'application/json' },
      statusCode: 204,
    });
    expect(mockDeleteShortUrl).toBeCalledWith({ token: 'token', id: 'testId' });
  });

  it('should return with status 204 no content call cleanAll and do not pass id', async () => {
    mockDeleteShortUrl.mockResolvedValueOnce(10);
    const result = await removeUrl({ ...req, body: { cleanAll: true, id: 'testId' } });
    expect(result).toEqual({
      headers: { 'content-type': 'application/json' },
      statusCode: 204,
    });
    expect(mockDeleteShortUrl).toBeCalledWith({ token: 'token' });
  });

  it('should return error in body with status 500', async () => {
    mockDeleteShortUrl.mockRejectedValueOnce(new Error('somethings going on'));
    const result = await removeUrl(req);
    expect(result).toEqual({
      headers: { 'content-type': 'application/json' },
      statusCode: 500,
      body: {
        error: 'somethings going on',
      },
    });
  });

  it('should return fallback error  in body with status 500', async () => {
    mockDeleteShortUrl.mockRejectedValueOnce(undefined);
    const result = await removeUrl(req);
    expect(result).toEqual({
      headers: { 'content-type': 'application/json' },
      statusCode: 500,
      body: {
        error: 'something went wrong',
      },
    });
  });
});
