import { ObjectId } from 'mongodb';
import { makeShortUrl as makeShortUrlInAction } from '.';
import { buildMakeShortUrl, getAddedDate, ShortUrl } from './shortUrl';

const mockGetShortUrl = jest.fn();
const mockIsValidId = jest.fn();
const mockIdGenerator = jest.fn();

const mockDependencies = {
  getShortUrl: mockGetShortUrl,
  isValidId: mockIsValidId,
  idGenerator: mockIdGenerator,
};

describe('buildMakeShortUrl isolation', () => {
  let makeShortUrl: ReturnType<typeof buildMakeShortUrl>;
  const defaultParams = {
    url: 'http://external.test/domain',
    sessionToken: 'token',
  };
  const existingShortUrl = {
    id: 'testId',
    shortUrl: 'http://test.com/87654321',
    urlCode: '87654321',
    clicks: 2,
    createdAt: new Date('2022-03-01T00:00:00.000Z'),
    expireAt: new Date('2022-03-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    mockGetShortUrl.mockReturnValue('http://test.com/12345678');
    mockIdGenerator.mockReturnValue('12345678');
    mockIsValidId.mockReturnValue(true);
    makeShortUrl = buildMakeShortUrl(mockDependencies);
  });

  afterEach(() => {
    mockGetShortUrl.mockReset();
    mockIdGenerator.mockReset();
    mockIsValidId.mockReset();
  });

  describe('happy path', () => {
    describe('initialize new shortUrl', () => {
      beforeEach(() => {
        jest.useFakeTimers().setSystemTime(new Date('2022-02-01T00:00:00').getTime());
      });

      it('initialize with url and sessionToken', () => {
        const shortUrl = makeShortUrl(defaultParams);
        expect(shortUrl.getId()).toEqual(undefined);
        expect(shortUrl.getSessionToken()).toEqual('token');
        expect(shortUrl.getClicks()).toEqual(0);
        expect(shortUrl.getLongUrl()).toEqual('http://external.test/domain');
        expect(shortUrl.getCreatedAt().toISOString()).toEqual('2022-02-01T00:00:00.000Z');
        expect(shortUrl.getExpireAt().toISOString()).toEqual('2022-02-08T00:00:00.000Z');
        expect(shortUrl.getShortUrl()).toEqual('http://test.com/12345678');
        expect(shortUrl.getUrlCode()).toEqual('12345678');
        expect(shortUrl.getObj()).toEqual({
          id: undefined,
          sessionToken: 'token',
          clicks: 0,
          url: 'http://external.test/domain',
          shortUrl: 'http://test.com/12345678',
          urlCode: '12345678',
          createdAt: new Date('2022-02-01T00:00:00.000Z'),
          expireAt: new Date('2022-02-08T00:00:00.000Z'),
        });
      });

      it('mutate urlCode and shortUrl', () => {
        const shortUrl = makeShortUrl(defaultParams);
        expect(shortUrl.getShortUrl()).toEqual('http://test.com/12345678');
        expect(shortUrl.getUrlCode()).toEqual('12345678');
        mockIdGenerator.mockReturnValue('abcdefgh');
        mockGetShortUrl.mockReturnValue('http://test.com/abcdefgh');
        expect(shortUrl.regenerateUrlCode()).toEqual({
          urlCode: 'abcdefgh',
          shortUrl: 'http://test.com/abcdefgh',
        });
        expect(shortUrl.getShortUrl()).toEqual('http://test.com/abcdefgh');
        expect(shortUrl.getUrlCode()).toEqual('abcdefgh');
      });

      it('expireAt should be default 7 days', () => {
        const shortUrl = makeShortUrl(defaultParams);
        expect(shortUrl.getCreatedAt().toISOString()).toEqual('2022-02-01T00:00:00.000Z');
        expect(shortUrl.getExpireAt().toISOString()).toEqual('2022-02-08T00:00:00.000Z');
      });

      it('expireAt should be 30 days', () => {
        const shortUrl = makeShortUrl(defaultParams, 30);
        expect(shortUrl.getCreatedAt().toISOString()).toEqual('2022-02-01T00:00:00.000Z');
        expect(shortUrl.getExpireAt().toISOString()).toEqual('2022-03-03T00:00:00.000Z');
      });
    });

    describe('initialize from existing shortUrl', () => {
      it('initialize with shortUrl object', () => {
        const shortUrl = makeShortUrl({ ...defaultParams, ...existingShortUrl });
        expect(shortUrl.getId()).toEqual('testId');
        expect(shortUrl.getSessionToken()).toEqual('token');
        expect(shortUrl.getClicks()).toEqual(2);
        expect(shortUrl.getLongUrl()).toEqual('http://external.test/domain');
        expect(shortUrl.getCreatedAt().toISOString()).toEqual('2022-03-01T00:00:00.000Z');
        expect(shortUrl.getShortUrl()).toEqual('http://test.com/87654321');
        expect(shortUrl.getUrlCode()).toEqual('87654321');
      });

      it('mutate urlCode and shortUrl', () => {
        const shortUrl = makeShortUrl({ ...defaultParams, ...existingShortUrl });
        expect(shortUrl.getShortUrl()).toEqual('http://test.com/87654321');
        expect(shortUrl.getUrlCode()).toEqual('87654321');
        mockIdGenerator.mockReturnValue('abcdefgh');
        mockGetShortUrl.mockReturnValue('http://test.com/abcdefgh');
        expect(shortUrl.regenerateUrlCode()).toEqual({
          urlCode: 'abcdefgh',
          shortUrl: 'http://test.com/abcdefgh',
        });
        expect(shortUrl.getShortUrl()).toEqual('http://test.com/abcdefgh');
        expect(shortUrl.getUrlCode()).toEqual('abcdefgh');
      });

      it('expireAt should be update to default 7 days', () => {
        jest.useFakeTimers().setSystemTime(new Date('2022-03-01T00:00:00').getTime());
        const shortUrl = makeShortUrl({ ...defaultParams, ...existingShortUrl });
        expect(shortUrl.getCreatedAt().toISOString()).toEqual('2022-03-01T00:00:00.000Z');
        expect(shortUrl.getExpireAt().toISOString()).toEqual('2022-03-08T00:00:00.000Z');
      });

      it('expireAt should be update to default 20 days', () => {
        jest.useFakeTimers().setSystemTime(new Date('2022-03-01T00:00:00').getTime());
        const shortUrl = makeShortUrl({ ...defaultParams, ...existingShortUrl }, 20);
        expect(shortUrl.getCreatedAt().toISOString()).toEqual('2022-03-01T00:00:00.000Z');
        expect(shortUrl.getExpireAt().toISOString()).toEqual('2022-03-21T00:00:00.000Z');
      });
    });
  });

  describe('un happy path', () => {
    describe('attempt to initialize new shortUrl', () => {
      it("initialize without url should throw 'url must have a valid type'", () => {
        expect(() =>
          makeShortUrl({ sessionToken: defaultParams.sessionToken } as ShortUrl)
        ).toThrow(new Error('url must have a valid type'));
      });

      it("initialize without sessionToken should throw 'must have a valid sessionToken'", () => {
        expect(() => makeShortUrl({ url: defaultParams.url } as ShortUrl)).toThrow(
          new Error('must have a valid sessionToken')
        );
      });
    });

    describe('attempt to initialize from shortUrl object', () => {
      it("initialize without urlCode should throw 'existing object must have a urlCode'", () => {
        expect(() =>
          makeShortUrl({
            ...defaultParams,
            ...existingShortUrl,
            urlCode: undefined,
          } as unknown as ShortUrl)
        ).toThrow(new Error('existing object must have a urlCode'));
      });

      it("initialize without shortUrl should throw 'existing object must have a shortUrl'", () => {
        expect(() =>
          makeShortUrl({
            ...defaultParams,
            ...existingShortUrl,
            shortUrl: undefined,
          } as unknown as ShortUrl)
        ).toThrow(new Error('existing object must have a shortUrl'));
      });

      it("initialize with invalid clicks type should throw 'existing object must have valid clicks type'", () => {
        expect(() =>
          makeShortUrl({
            ...defaultParams,
            ...existingShortUrl,
            clicks: undefined,
          } as unknown as ShortUrl)
        ).toThrow(new Error('existing object must have valid clicks type'));
      });

      it("initialize without id should throw 'existing object must have a id'", () => {
        expect(() =>
          makeShortUrl({
            ...defaultParams,
            ...existingShortUrl,
            id: undefined,
          } as unknown as ShortUrl)
        ).toThrow(new Error('existing object must have a id'));
      });

      it("initialize with invalid id should throw 'existing object must have a valid db id'", () => {
        mockIsValidId.mockReturnValue(false);
        expect(() =>
          makeShortUrl({ ...defaultParams, ...existingShortUrl, id: 'invalidId' } as ShortUrl)
        ).toThrow(new Error('existing object must have a valid db id'));
      });
    });
  });
});

describe('makeShortUrlInAction', () => {
  it('should create new shortUrl', () => {
    const shortUrl = makeShortUrlInAction({ url: 'https://test.com', sessionToken: 'token' });
    const urlCode = shortUrl.getUrlCode();
    expect(urlCode.length).toBe(8);
    expect(shortUrl.getShortUrl()).toEqual(`http://test-env.com/${urlCode}`);
    expect(shortUrl.getLongUrl()).toEqual('https://test.com');
    expect(shortUrl.getSessionToken()).toEqual('token');
    const { shortUrl: newShortUrl, urlCode: newUrlCode } = shortUrl.regenerateUrlCode();
    expect(newUrlCode.length).toBe(8);
    expect(shortUrl.getUrlCode()).toBe(newUrlCode);
    expect(newShortUrl).toEqual(`http://test-env.com/${newUrlCode}`);
    expect(shortUrl.getShortUrl()).toEqual(`http://test-env.com/${newUrlCode}`);
  });

  it('should create from shortUrl object', () => {
    const shortUrl = makeShortUrlInAction({
      url: 'https://test.com',
      sessionToken: 'token',
      id: new ObjectId().toString(),
      createdAt: new Date(),
      expireAt: new Date(),
      shortUrl: 'http://test-env.com/12345678',
      urlCode: '12345678',
      clicks: 20,
    });
    expect(shortUrl.getShortUrl()).toEqual(`http://test-env.com/12345678`);
    expect(shortUrl.getLongUrl()).toEqual('https://test.com');
    expect(shortUrl.getSessionToken()).toEqual('token');
    const { urlCode: newUrlCode, shortUrl: newShortUrl } = shortUrl.regenerateUrlCode();
    expect(newUrlCode.length).toBe(8);
    expect(shortUrl.getUrlCode()).toBe(newUrlCode);
    expect(newShortUrl).toEqual(`http://test-env.com/${newUrlCode}`);
    expect(shortUrl.getShortUrl()).toEqual(`http://test-env.com/${newUrlCode}`);
  });

  it('should throw an error with invalid objectId', () => {
    expect(() =>
      makeShortUrlInAction({
        url: 'https://test.com',
        sessionToken: 'token',
        id: 'invalid',
        createdAt: new Date(),
        expireAt: new Date(),
        shortUrl: 'http://test-env.com/12345678',
        urlCode: '12345678',
        clicks: 20,
      })
    ).toThrow(new Error('existing object must have a valid db id'));
  });
});

describe('getExpireTime', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2022-02-01T00:00:00').getTime());
  });

  it.each`
    day   | expected
    ${1}  | ${'2022-02-02T00:00:00.000Z'}
    ${10} | ${'2022-02-11T00:00:00.000Z'}
    ${20} | ${'2022-02-21T00:00:00.000Z'}
    ${30} | ${'2022-02-31T00:00:00.000Z'}
    ${40} | ${'2022-03-13T00:00:00.000Z'}
  `(
    'add $day day to current time 28-03-2022',
    ({ day, expected }: { day: number; expected: string }) => {
      const now = new Date(Date.now());
      expect(getAddedDate(now, day)).toEqual(new Date(expected));
    }
  );
});
