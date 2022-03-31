import { RequestObj, EmptyObj } from 'types';
import { makeGetShortenedUrls } from './listUrls';

const mockGetShortUrls = jest.fn();

describe('CONTROLLER: list Short Urls ', () => {
  let getShortenedUrls: ReturnType<typeof makeGetShortenedUrls>;
  const req = {
    body: {},
    cookies: { token: 'token' },
    query: { limit: '5', lastId: undefined },
  } as RequestObj<EmptyObj, { token: string }, { limit?: string; lastId?: string }>;

  beforeAll(() => {
    getShortenedUrls = makeGetShortenedUrls({ getShortUrls: mockGetShortUrls });
  });

  afterEach(() => {
    mockGetShortUrls.mockReset();
  });

  it('should return shortUrls in body with status 200', async () => {
    mockGetShortUrls.mockResolvedValueOnce([
      { url: 'https://test.com/1', urlCode: '12345678', shortUrl: 'http://mock.com/12345678' },
      { url: 'https://test.com/2', urlCode: '22345678', shortUrl: 'http://mock.com/22345678' },
    ]);
    const result = await getShortenedUrls(req);
    expect(result).toEqual({
      headers: { 'content-type': 'application/json' },
      statusCode: 200,
      body: {
        shortUrls: [
          { url: 'https://test.com/1', urlCode: '12345678', shortUrl: 'http://mock.com/12345678' },
          { url: 'https://test.com/2', urlCode: '22345678', shortUrl: 'http://mock.com/22345678' },
        ],
      },
    });
    expect(mockGetShortUrls).toBeCalledWith({
      limit: 5,
      lastId: undefined,
      sessionToken: 'token',
    });
  });

  it('should call getShortUrls with fallback limit and lastId', async () => {
    mockGetShortUrls.mockResolvedValueOnce([
      { url: 'https://test.com/1', urlCode: '12345678', shortUrl: 'http://mock.com/12345678' },
    ]);
    const result = await getShortenedUrls({
      ...req,
      query: { limit: undefined, lastId: 'testId' },
    });
    expect(result).toEqual({
      headers: { 'content-type': 'application/json' },
      statusCode: 200,
      body: {
        shortUrls: [
          { url: 'https://test.com/1', urlCode: '12345678', shortUrl: 'http://mock.com/12345678' },
        ],
      },
    });
    expect(mockGetShortUrls).toBeCalledWith({ limit: 10, lastId: 'testId', sessionToken: 'token' });
  });

  it('should return error in body with status 500', async () => {
    mockGetShortUrls.mockRejectedValueOnce(new Error('something going on'));
    const result = await getShortenedUrls(req);
    expect(result).toEqual({
      headers: { 'content-type': 'application/json' },
      statusCode: 500,
      body: { error: 'something going on' },
    });
  });

  it('should return fallback error in body with status 500', async () => {
    mockGetShortUrls.mockRejectedValueOnce(undefined);
    const result = await getShortenedUrls(req);
    expect(result).toEqual({
      headers: { 'content-type': 'application/json' },
      statusCode: 500,
      body: { error: 'something went wrong' },
    });
  });
});
