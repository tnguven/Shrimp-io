import { ShortUrlDb } from '@data-access';
import { makeAddShortUrl } from './addShortUrl';

const mockFindByUrlCode = jest.fn();
const mockFindByUrl = jest.fn();
const mockInsert = jest.fn();

const mockShortUrlDb = {
  findByUrlCode: mockFindByUrlCode,
  findByUrl: mockFindByUrl,
  insert: mockInsert,
} as unknown as ShortUrlDb;

describe('USE CASE: add ShortUrl', () => {
  let shortUrlUseCase: ReturnType<typeof makeAddShortUrl>;

  beforeAll(() => {
    shortUrlUseCase = makeAddShortUrl({ shortUrlDb: mockShortUrlDb });
  });

  afterEach(() => {
    mockFindByUrlCode.mockReset();
    mockFindByUrl.mockReset();
    mockInsert.mockReset();
  });

  describe('new url', () => {
    beforeEach(() => {
      mockFindByUrl.mockResolvedValueOnce(null);
      mockInsert.mockResolvedValue({
        id: 'stringId',
        url: 'https://test.com/1',
        urlCode: '12345678',
        shortUrl: 'http://mock.com/12345678',
        sessionToken: 'token',
      });
    });

    it('must add url and return saved document without sessionToken', async () => {
      mockFindByUrlCode.mockResolvedValueOnce(null);
      const newUrl = await shortUrlUseCase({ url: 'https://test.com/1', token: 'token' });
      expect(newUrl).toEqual({
        shortUrl: {
          id: 'stringId',
          url: 'https://test.com/1',
          urlCode: '12345678',
          shortUrl: 'http://mock.com/12345678',
        },
        existingUrl: false,
      });
    });

    it('must add url with recursive urlCode check', async () => {
      mockFindByUrlCode
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce(null);
      const newUrl = await shortUrlUseCase({ url: 'https://test.com/1', token: 'token' });
      expect(newUrl).toEqual({
        shortUrl: {
          id: 'stringId',
          url: 'https://test.com/1',
          urlCode: '12345678',
          shortUrl: 'http://mock.com/12345678',
        },
        existingUrl: false,
      });
      expect(mockFindByUrlCode).toBeCalledTimes(4);
    });
  });

  it('must return existing url without session token', async () => {
    mockFindByUrl.mockResolvedValueOnce({
      id: 'stringId',
      url: 'https://test.com/1',
      urlCode: '12345678',
      shortUrl: 'http://mock.com/12345678',
      sessionToken: 'token',
    });
    const newUrl = await shortUrlUseCase({ url: 'https://test.com/1', token: 'token' });
    expect(newUrl).toEqual({
      shortUrl: {
        id: 'stringId',
        url: 'https://test.com/1',
        urlCode: '12345678',
        shortUrl: 'http://mock.com/12345678',
      },
      existingUrl: true,
    });
    expect(mockFindByUrlCode).toBeCalledTimes(0);
    expect(mockInsert).toBeCalledTimes(0);
  });
});
