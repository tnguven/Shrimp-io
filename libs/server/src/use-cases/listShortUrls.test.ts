import { ShortUrlDb } from '@data-access';
import { makeGetShortUrls } from './listShortUrls';

const mockFindAll = jest.fn();

const mockShortUrlDb = {
  findAll: mockFindAll,
} as unknown as ShortUrlDb;

describe('USE CASE: list short urls ', () => {
  let getShortUrls: ReturnType<typeof makeGetShortUrls>;

  beforeAll(() => {
    getShortUrls = makeGetShortUrls({ shortUrlDb: mockShortUrlDb });
  });

  afterEach(() => {
    mockFindAll.mockReset();
  });

  it('should return list of urls without sessionToken field', async () => {
    mockFindAll.mockResolvedValueOnce([
      { url: 'test', sessionToken: 'token' },
      { url: 'test2', sessionToken: 'token' },
      { url: 'test3', sessionToken: 'token' },
    ]);
    const result = await getShortUrls({ limit: 10, lastId: '', sessionToken: 'token' });
    expect(result).toEqual([{ url: 'test' }, { url: 'test2' }, { url: 'test3' }]);
  });

  it('should return empty array', async () => {
    mockFindAll.mockResolvedValueOnce([]);
    const result = await getShortUrls({ limit: 10, lastId: '', sessionToken: 'token' });
    expect(result).toEqual([]);
  });
});
