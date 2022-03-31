import { RequestObj, EmptyObj } from 'types';
import { makeRedirectShortUrl } from './redirectShortUrl';

const mockIncreaseShortUrlClick = jest.fn();

describe('CONTROLLER: redirect short url ', () => {
  let redirectShortUrl: ReturnType<typeof makeRedirectShortUrl>;
  const req = {
    params: { urlCode: '12345678' },
    body: {},
    cookies: {},
    query: {},
  } as RequestObj<EmptyObj, EmptyObj, EmptyObj, { urlCode: string }>;

  beforeAll(() => {
    redirectShortUrl = makeRedirectShortUrl({ increaseShortUrlClick: mockIncreaseShortUrlClick });
  });

  afterEach(() => {
    mockIncreaseShortUrlClick.mockReset();
  });

  it('should redirect with status 302', async () => {
    mockIncreaseShortUrlClick.mockResolvedValueOnce('https://test.com/1');
    const result = await redirectShortUrl(req);
    expect(result).toEqual({
      headers: { 'content-type': 'application/json' },
      statusCode: 302,
      redirect: 'https://test.com/1',
    });
    expect(mockIncreaseShortUrlClick).toBeCalledWith('12345678');
  });

  it('should redirect with status 404', async () => {
    mockIncreaseShortUrlClick.mockResolvedValueOnce(undefined);
    const result = await redirectShortUrl(req);
    expect(result).toEqual({
      headers: { 'content-type': 'application/json' },
      statusCode: 404,
      redirect: '/404',
    });
  });

  it('should return error in body with status 500', async () => {
    mockIncreaseShortUrlClick.mockRejectedValueOnce(new Error('something going on'));
    const result = await redirectShortUrl(req);
    expect(result).toEqual({
      headers: { 'content-type': 'application/json' },
      statusCode: 500,
      body: { error: 'something going on' },
    });
  });

  it('should return fallback error in body with status 500', async () => {
    mockIncreaseShortUrlClick.mockRejectedValueOnce(undefined);
    const result = await redirectShortUrl(req);
    expect(result).toEqual({
      headers: { 'content-type': 'application/json' },
      statusCode: 500,
      body: { error: 'something went wrong' },
    });
  });
});
