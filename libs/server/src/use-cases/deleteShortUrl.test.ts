import { ShortUrlDb } from '@data-access';
import { makeDeleteShortUrl } from './deleteShortUrl';

const mockRemoveByIdAndSessionToken = jest.fn();
const mockRemoveBySessionToken = jest.fn();

const mockShortUrlDb = {
  removeByIdAndSessionToken: mockRemoveByIdAndSessionToken,
  removeBySessionToken: mockRemoveBySessionToken,
} as unknown as ShortUrlDb;

describe('USE CASE: delete ShortUrl', () => {
  let deleteShortUrlCase: ReturnType<typeof makeDeleteShortUrl>;

  beforeAll(() => {
    deleteShortUrlCase = makeDeleteShortUrl({ shortUrlDb: mockShortUrlDb });
  });

  afterEach(() => {
    mockRemoveByIdAndSessionToken.mockReset();
    mockRemoveBySessionToken.mockReset();
  });

  it('delete single record via record id', async () => {
    mockRemoveByIdAndSessionToken.mockResolvedValueOnce(1);
    const result = await deleteShortUrlCase({ id: 'testId', token: 'token' });
    expect(result).toBe(1);
    expect(mockRemoveBySessionToken).toBeCalledTimes(0);
  });

  it('delete all record via sessionToken', async () => {
    mockRemoveBySessionToken.mockResolvedValueOnce(10);
    const result = await deleteShortUrlCase({ token: 'token' });
    expect(result).toBe(10);
    expect(mockRemoveByIdAndSessionToken).toBeCalledTimes(0);
  });
});
