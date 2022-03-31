import { ShortUrlDb } from '@data-access';
import { makeIncreaseShortUrlClick } from './increasShortUrlClick';

const mockIncreaseClicks = jest.fn();
const mockFindByUrlCode = jest.fn();

const mockShortUrlDb = {
  findByUrlCode: mockFindByUrlCode,
  increaseClicks: mockIncreaseClicks,
} as unknown as ShortUrlDb;

describe('USE CASE: increase short url ', () => {
  let increaseShortUrlClick: ReturnType<typeof makeIncreaseShortUrlClick>;

  beforeAll(() => {
    increaseShortUrlClick = makeIncreaseShortUrlClick({ shortUrlDb: mockShortUrlDb });
  });

  afterEach(() => {
    mockIncreaseClicks.mockReset();
    mockFindByUrlCode.mockReset();
  });

  it('should call increaseClicks and return existing document', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2022-04-10T12:00:50.318Z').getTime());
    mockFindByUrlCode.mockResolvedValueOnce({
      id: '62455835c14ec99768b22d9b',
      sessionToken: 'e8b15e19-16f2-4b03-8279-847b503cb14c',
      createdAt: '2022-03-27T12:00:50.318Z',
      expireAt: '2022-04-10T12:00:50.318Z',
      clicks: 0,
      url: 'https://test.url/test1',
      shortUrl: 'http://test-env.com/abcd1000',
      urlCode: 'abcd1000',
    });
    const result = await increaseShortUrlClick('abcd1000');
    expect(result).toEqual('https://test.url/test1');
    expect(mockFindByUrlCode).toBeCalledWith('abcd1000');
    expect(mockIncreaseClicks).toBeCalledWith({
      id: '62455835c14ec99768b22d9b',
      expireAt: new Date('2022-04-17T13:00:50.000Z'),
    });
    expect(mockIncreaseClicks).toBeCalledTimes(1);
  });

  it('should not call increaseClicks and return undefined', async () => {
    mockFindByUrlCode.mockResolvedValueOnce(null);
    const result = await increaseShortUrlClick('test');
    expect(result).toEqual(undefined);
    expect(mockFindByUrlCode).toBeCalledWith('test');
    expect(mockIncreaseClicks).toBeCalledTimes(0);
  });
});
