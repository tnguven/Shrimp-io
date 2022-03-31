import { RequestObj } from 'types';
import { makeInsertShortUrl } from './insertShortUrl';

const mockAddShortUrl = jest.fn();

describe('CONTROLLER: insertShortUrl ', () => {
  let insertShortUrl: ReturnType<typeof makeInsertShortUrl>;
  const req = {
    body: { url: 'https://test.com' },
    cookies: { token: 'token' },
  } as RequestObj<{ url: string }, { token: string }>;

  beforeAll(() => {
    insertShortUrl = makeInsertShortUrl({ addShortUrl: mockAddShortUrl });
  });

  afterEach(() => {
    mockAddShortUrl.mockReset();
  });

  it('should return shortUrl in body with status 200', async () => {
    mockAddShortUrl.mockResolvedValueOnce({
      shortUrl: {
        url: 'https://test.com/1',
        urlCode: '12345678',
        shortUrl: 'http://mock.com/12345678',
      },
      existingUrl: false,
    });
    const result = await insertShortUrl(req);
    expect(result).toEqual({
      headers: { 'content-type': 'application/json' },
      statusCode: 200,
      body: {
        shortUrl: {
          url: 'https://test.com/1',
          urlCode: '12345678',
          shortUrl: 'http://mock.com/12345678',
        },
      },
    });
  });

  it('should return shortUrl in body with status 302', async () => {
    mockAddShortUrl.mockResolvedValueOnce({
      shortUrl: {
        url: 'https://test.com/1',
        urlCode: '12345678',
        shortUrl: 'http://mock.com/12345678',
      },
      existingUrl: true,
    });
    const result = await insertShortUrl(req);
    expect(result).toEqual({
      headers: { 'content-type': 'application/json' },
      statusCode: 302,
      body: {
        shortUrl: {
          url: 'https://test.com/1',
          urlCode: '12345678',
          shortUrl: 'http://mock.com/12345678',
        },
      },
    });
  });

  it('should return error in body with status 500', async () => {
    mockAddShortUrl.mockRejectedValueOnce(new Error('somethings going on'));
    const result = await insertShortUrl(req);
    expect(result).toEqual({
      headers: { 'content-type': 'application/json' },
      statusCode: 500,
      body: {
        error: 'somethings going on',
      },
    });
  });

  it('should return fallback error  in body with status 500', async () => {
    mockAddShortUrl.mockRejectedValueOnce(undefined);
    const result = await insertShortUrl(req);
    expect(result).toEqual({
      headers: { 'content-type': 'application/json' },
      statusCode: 500,
      body: {
        error: 'something went wrong',
      },
    });
  });
});
