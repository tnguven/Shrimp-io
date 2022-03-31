import httpStatus from 'http-status';
import { MongoClient, Db } from 'mongodb';
import {
  requestWithCookie,
  requestWithoutCookie,
  requestWithDummyCookie,
  v1Uuid,
  validObjectId,
  invalidId,
  v4Uuid,
  preExistDummyToken,
  preExistData,
} from './tools';
import { connectDb } from '../src/db/mongoDb';
import { ShortUrl } from '../src/short-url/shortUrl';

describe('shorten route /v1/shorten', () => {
  const routePath = '/v1/shorten';
  let connection: MongoClient;
  let db: Db;

  beforeAll(async () => {
    connection = await connectDb();
    db = connection.db(process.env.MONGO_DATABASE);
  });

  afterAll(async () => {
    await db.collection('shortUrls').drop();
    await connection.close();
  });

  beforeEach(async () => {
    await db.collection('shortUrls').insertMany(preExistData());
  });

  afterEach(async () => {
    await db.collection('shortUrls').deleteMany({ sessionToken: preExistDummyToken });
  });

  describe('GET happy path', () => {
    it.each`
      scenario                                      | query
      ${'no query'}                                 | ${'/'}
      ${'query has only limit'}                     | ${'?limit=10'}
      ${'query has only valid lastId'}              | ${`?lastId=${validObjectId}`}
      ${'query has max limit and valid lastId'}     | ${`?limit=50&lastId=${validObjectId}`}
      ${'query has valid lastId and has min limit'} | ${`?lastId=${validObjectId}&limit=1`}
    `(
      `should return status ${httpStatus.OK} and empty array for new session with $scenario`,
      async ({ query }: { query: string }) => {
        await requestWithCookie(`${routePath}${query}`, 'get')
          .expect(httpStatus.OK)
          .expect((res) => {
            expect(res.body).toEqual({ shortUrls: [] });
          });
      }
    );

    it.each`
      scenario                                      | query
      ${'no query'}                                 | ${'/'}
      ${'query has only limit'}                     | ${'?limit=10'}
      ${'query has only valid lastId'}              | ${`?lastId=${validObjectId}`}
      ${'query has max limit and valid lastId'}     | ${`?limit=50&lastId=${validObjectId}`}
      ${'query has valid lastId and has min limit'} | ${`?lastId=${validObjectId}&limit=1`}
    `(
      `should return status ${httpStatus.OK} with set cookie token`,
      async ({ query }: { query: string }) => {
        await requestWithoutCookie(`${routePath}${query}`, 'get')
          .expect(httpStatus.OK)
          .expect((res) => {
            const cookieStr = res.headers['set-cookie'][0];
            const [val, maxAge, path, httpOnly, secure, strict] = cookieStr.split(' ');
            expect(val).toContain('token');
            expect(maxAge.slice(0, -1)).toBe('Max-Age=7776000');
            expect(path.slice(0, -1)).toBe('Path=/');
            expect(httpOnly.slice(0, -1)).toBe('HttpOnly');
            expect(secure.slice(0, -1)).toBe('Secure');
            expect(strict).toBe('SameSite=Strict');
            expect(res.body).toEqual({ shortUrls: [] });
          });
      }
    );

    it('should return default 10 record when limit is not defined', async () => {
      await requestWithDummyCookie(routePath, 'get')
        .expect(httpStatus.OK)
        .expect(({ body }) => {
          expect(body.shortUrls.length).toBe(10);
        });
    });

    it('should not return sessionToken in the response object', async () => {
      await requestWithDummyCookie(routePath, 'get')
        .expect(httpStatus.OK)
        .expect((res) => {
          expect(res.body.shortUrls.length).toBe(10);
          res.body.shortUrls.forEach((item: object) => {
            expect(item).not.toHaveProperty('sessionToken');
          });
        });
    });

    it.each`
      query          | expected
      ${'?limit=1'}  | ${1}
      ${'?limit=5'}  | ${5}
      ${'?limit=15'} | ${15}
    `(
      `should return $expected record => $query`,
      async ({ query, expected }: { query: string; expected: number }) => {
        await requestWithDummyCookie(`${routePath}${query}`, 'get')
          .expect(httpStatus.OK)
          .expect(({ body }) => {
            expect(body.shortUrls.length).toBe(expected);
            body.shortUrls.forEach((item: ShortUrl) => {
              expect(item.id).toBeDefined();
              expect(item.urlCode).toBeDefined();
              expect(item.shortUrl).toBeDefined();
              expect(item.url).toBeDefined();
              expect(item.createdAt).toBeDefined();
              expect(item.expireAt).toBeDefined();
              expect(item.clicks).toBeDefined();
              expect(item.sessionToken).not.toBeDefined();
            });
          });
      }
    );

    it('should return descending created order', async () => {
      await requestWithCookie(`${routePath}?limit=5`, 'get')
        .set('Cookie', [`token=${preExistDummyToken}`])
        .expect(httpStatus.OK)
        .expect((res) => {
          expect(res.body.shortUrls.length).toBe(5);
          const [first, second, third, forth, fifth] = res.body.shortUrls;
          expect(first.createdAt).toBe('2022-03-30T15:00:50.318Z');
          expect(second.createdAt).toBe('2022-03-30T14:00:50.318Z');
          expect(third.createdAt).toBe('2022-03-30T13:00:50.318Z');
          expect(forth.createdAt).toBe('2022-03-30T13:00:50.318Z');
          expect(fifth.createdAt).toBe('2022-03-30T12:00:50.318Z');
        });
    });

    it('should paginate descending by created order', async () => {
      let lastId = '';
      await requestWithCookie(`${routePath}?limit=5`, 'get')
        .set('Cookie', [`token=${preExistDummyToken}`])
        .expect(httpStatus.OK)
        .expect(({ body }) => {
          const shortUrls = body.shortUrls;
          lastId = shortUrls.at(-1).id;
          expect(shortUrls.length).toBe(5);
          expect(body.shortUrls.at(-1).createdAt).toBe('2022-03-30T12:00:50.318Z');
        });

      await requestWithCookie(`${routePath}?limit=5&lastId=${lastId}`, 'get')
        .set('Cookie', [`token=${preExistDummyToken}`])
        .expect(httpStatus.OK)
        .expect(({ body }) => {
          const shortUrls = body.shortUrls;
          lastId = shortUrls.at(-1).id;
          expect(shortUrls.length).toBe(5);
          expect(body.shortUrls.at(-1).createdAt).toBe('2022-03-27T17:00:50.318Z');
        });

      await requestWithCookie(`${routePath}?limit=5&lastId=${lastId}`, 'get')
        .set('Cookie', [`token=${preExistDummyToken}`])
        .expect(httpStatus.OK)
        .expect(({ body }) => {
          const shortUrls = body.shortUrls;
          lastId = shortUrls.at(-1).id;
          expect(shortUrls.length).toBe(5);
          expect(body.shortUrls.at(-1).createdAt).toBe('2022-03-27T12:00:50.318Z');
        });

      await requestWithCookie(`${routePath}?limit=5&lastId=${lastId}`, 'get')
        .set('Cookie', [`token=${preExistDummyToken}`])
        .expect(httpStatus.OK)
        .expect(({ body }) => {
          expect(body.shortUrls.length).toBe(0);
        });
    });
  });

  describe('GET unhappy path', () => {
    it.each`
      scenario           | id          | expected
      ${'v1uuid'}        | ${v1Uuid}   | ${`"${v1Uuid}" must be a valid token`}
      ${'random string'} | ${'testId'} | ${'"testId" must be a valid token'}
    `(
      `should return status ${httpStatus.UNAUTHORIZED} while token cookie is $scenario`,
      async ({ id, expected }: { id: string; expected: string }) => {
        await requestWithoutCookie(routePath, 'get')
          .set('Cookie', [`token=${id}`])
          .expect(httpStatus.UNAUTHORIZED)
          .expect((res) => {
            expect(res.body).toEqual({ error: expected });
          });
      }
    );

    it.each`
      scenario                                          | query                                  | expected
      ${'limit has zero'}                               | ${'?limit=0'}                          | ${'"limit" must be a positive number'}
      ${'limit has negative number'}                    | ${'?limit=-1'}                         | ${'"limit" must be a positive number'}
      ${'limit has reach the max 50 and has validId'}   | ${`?limit=51&lastId=${validObjectId}`} | ${'"limit" must be less than or equal to 50'}
      ${'limit has reach the max 50 and has invalidId'} | ${`?limit=51&lastId=${invalidId}`}     | ${'"testId" must be a valid id, "limit" must be less than or equal to 50'}
      ${'lastId has invalid value'}                     | ${`?lastId=${invalidId}`}              | ${'"testId" must be a valid id'}
      ${'query has valid lastId and has min limit'}     | ${`?lastId=${invalidId}&limit=0`}      | ${'"testId" must be a valid id, "limit" must be a positive number'}
      ${'query has unknown field test'}                 | ${`?test=some-value`}                  | ${'"test" is not allowed'}
    `(
      `should return status ${httpStatus.BAD_REQUEST} while $scenario`,
      async ({ query, expected }: { expected: string; query: string }) => {
        await requestWithCookie(`${routePath}${query}`, 'get')
          .expect(httpStatus.BAD_REQUEST)
          .expect((res) => {
            expect(res.body).toEqual({ error: expected });
          });
      }
    );
  });

  describe('POST happy path', () => {
    it.each`
      validLongUrl
      ${'http://me.io'}
      ${'https://me.io'}
      ${'http://test.com'}
      ${'https://test.com'}
      ${'http://123.32.1.1:8080/'}
      ${'https://123.32.1.1:8080/'}
      ${'http://user@example.com:8080'}
      ${'https://user@example.com:8080/'}
      ${'http://foo.com/blah_(wikipedia)#cite-1'}
      ${'https://foo.com/blah_(wikipedia)#cite-1'}
      ${'http://foo.com/blah_(wikipedia)_blah#cite-1'}
      ${'https://foo.com/blah_(wikipedia)_blah#cite-1'}
      ${'http://foo.com/(something)?after=parens'}
      ${'https://foo.com/(something)?after=parens'}
      ${'http://code.google.com/events/#&item=test'}
      ${'https://code.google.com/events/#&item=test'}
      ${'ftp://server.com'}
    `(
      `should return status ${httpStatus.OK} => $validLongUrl`,
      async ({ validLongUrl }: { validLongUrl: string }) => {
        await requestWithCookie(routePath, 'post')
          .send({ url: validLongUrl })
          .expect(httpStatus.OK)
          .expect(({ body }) => {
            expect(body.shortUrl).toHaveProperty('createdAt');
            expect(body.shortUrl).toHaveProperty('expireAt');
            expect(body.shortUrl).toHaveProperty('url');
            expect(body.shortUrl).toHaveProperty('shortUrl');
            expect(body.shortUrl).toHaveProperty('urlCode');
            expect(body.shortUrl).toHaveProperty('id');
            expect(body.shortUrl).toHaveProperty('clicks');
            expect(body.shortUrl).not.toHaveProperty('sessionToken');
          });
      }
    );

    it('should return existing record if the longUrl exist', async () => {
      const count = await db.collection('shortUrls').countDocuments({ sessionToken: v4Uuid });
      expect(count).toBe(17);
      await requestWithCookie(routePath, 'post')
        .send({ url: 'https://me.io' })
        .expect(httpStatus.FOUND)
        .expect((res) => {
          expect(res.body.shortUrl.url).toEqual('https://me.io');
        });
      const newCount = await db.collection('shortUrls').countDocuments({ sessionToken: v4Uuid });
      expect(newCount).toBe(17);
    });
  });

  describe('POST unhappy path', () => {
    it(`should return ${httpStatus.OK} and set the cookie if the cookie token does not provided`, async () => {
      await requestWithoutCookie(routePath, 'post')
        .send({ url: 'https://google.com' })
        .expect(httpStatus.OK)
        .expect(({ body, headers }) => {
          const cookieStr = headers['set-cookie'][0];
          const [val, maxAge, path, httpOnly, secure, strict] = cookieStr.split(' ');
          expect(val).toContain('token');
          expect(maxAge.slice(0, -1)).toBe('Max-Age=7776000');
          expect(path.slice(0, -1)).toBe('Path=/');
          expect(httpOnly.slice(0, -1)).toBe('HttpOnly');
          expect(secure.slice(0, -1)).toBe('Secure');
          expect(strict).toBe('SameSite=Strict');
          expect(body.shortUrl.id).toBeDefined();
          expect(body.shortUrl.urlCode).toBeDefined();
          expect(body.shortUrl.shortUrl).toBeDefined();
          expect(body.shortUrl.url).toBeDefined();
          expect(body.shortUrl.createdAt).toBeDefined();
          expect(body.shortUrl.expireAt).toBeDefined();
          expect(body.shortUrl.clicks).toBeDefined();
          expect(body.shortUrl.sessionToken).not.toBeDefined();
        });
    });

    it.each`
      invalidLongUrl                            | expected
      ${'http://⌘.ws'}                          | ${'"url" must be a valid uri'}
      ${'http://foo.com/unicode_(✪)_in_parens'} | ${'"url" must be a valid uri'}
      ${'http://☺.damowmow.com/'}               | ${'"url" must be a valid uri'}
      ${'http://'}                              | ${'"url" must be a valid uri, "url" with value "http://" fails to match the required pattern'}
      ${'http://.'}                             | ${'"url" with value "http://." fails to match the required pattern'}
      ${'http://..'}                            | ${'"url" with value "http://.." fails to match the required pattern'}
      ${'http://../'}                           | ${'"url" with value "http://../" fails to match the required pattern'}
      ${'http://?'}                             | ${'"url" must be a valid uri, "url" with value "http://?" fails to match the required pattern'}
      ${'http://??'}                            | ${'"url" must be a valid uri, "url" with value "http://??" fails to match the required pattern'}
      ${'http://??/'}                           | ${'"url" must be a valid uri, "url" with value "http://??/" fails to match the required pattern'}
      ${'http://#'}                             | ${'"url" must be a valid uri, "url" with value "http://#" fails to match the required pattern'}
      ${'http://##'}                            | ${'"url" must be a valid uri, "url" with value "http://##" fails to match the required pattern'}
      ${'http://foo.bar?q=Spaces space be'}     | ${'"url" must be a valid uri, "url" with value "http://foo.bar?q=Spaces space be" fails to match the required pattern'}
      ${'//'}                                   | ${'"url" must be a valid uri, "url" with value "//" fails to match the required pattern'}
      ${'//a'}                                  | ${'"url" must be a valid uri, "url" with value "//a" fails to match the required pattern'}
      ${'///'}                                  | ${'"url" must be a valid uri, "url" with value "///" fails to match the required pattern'}
      ${'http:///a'}                            | ${'"url" must be a valid uri, "url" with value "http:///a" fails to match the required pattern'}
      ${'foo.com'}                              | ${'"url" must be a valid uri, "url" with value "foo.com" fails to match the required pattern'}
      ${'rdar://1234'}                          | ${'"url" with value "rdar://1234" fails to match the required pattern'}
      ${'h://test'}                             | ${'"url" with value "h://test" fails to match the required pattern'}
      ${'http:// site.com'}                     | ${'"url" must be a valid uri, "url" with value "http:// site.com" fails to match the required pattern'}
      ${':// should fail'}                      | ${'"url" must be a valid uri, "url" with value ":// should fail" fails to match the required pattern'}
      ${'http://foo.bar/foo(bar)baz quux'}      | ${'"url" must be a valid uri, "url" with value "http://foo.bar/foo(bar)baz quux" fails to match the required pattern'}
      ${'http://.www.foo.bar/'}                 | ${'"url" with value "http://.www.foo.bar/" fails to match the required pattern'}
      ${'http://www.foo.bar./'}                 | ${'"url" with value "http://www.foo.bar./" fails to match the required pattern'}
      ${'ftps://foo.bar/'}                      | ${'"url" with value "ftps://foo.bar/" fails to match the required pattern'}
      ${'http://-error-.invalid/'}              | ${'"url" with value "http://-error-.invalid/" fails to match the required pattern'}
      ${'http://-a.b.co'}                       | ${'"url" with value "http://-a.b.co" fails to match the required pattern'}
      ${'http://a.b-.co'}                       | ${'"url" with value "http://a.b-.co" fails to match the required pattern'}
      ${'http://0.0.0.0'}                       | ${'"url" with value "http://0.0.0.0" fails to match the required pattern'}
      ${'http://10.1.1.0'}                      | ${'"url" with value "http://10.1.1.0" fails to match the required pattern'}
      ${'http://123.123.123'}                   | ${'"url" with value "http://123.123.123" fails to match the required pattern'}
      ${'http://10.1.1.255'}                    | ${'"url" with value "http://10.1.1.255" fails to match the required pattern'}
      ${'http://224.1.1.1'}                     | ${'"url" with value "http://224.1.1.1" fails to match the required pattern'}
      ${'http://3628126748'}                    | ${'"url" with value "http://3628126748" fails to match the required pattern'}
    `(
      `should return status ${httpStatus.BAD_REQUEST} => $invalidLongUrl`,
      async ({ invalidLongUrl, expected }: { invalidLongUrl: string; expected: string }) => {
        await requestWithCookie(routePath, 'post')
          .send({ url: invalidLongUrl })
          .expect(httpStatus.BAD_REQUEST)
          .expect(({ body }) => {
            expect(body.error).toBe(expected);
          });
      }
    );
  });

  describe('DELETE happy path', () => {
    it(`should return ${httpStatus.NO_CONTENT} delete single record by id`, async () => {
      const beforeDeletion = await db
        .collection('shortUrls')
        .find({ sessionToken: preExistDummyToken })
        .toArray();
      expect(beforeDeletion.length).toBe(15);
      const existingRecord = beforeDeletion[0];
      const id = existingRecord._id.toString();

      await requestWithDummyCookie(routePath, 'delete').send({ id }).expect(httpStatus.NO_CONTENT);

      const deletedRecord = await db.collection('shortUrls').findOne({ _id: existingRecord._id });
      expect(deletedRecord).toBe(null);
      const restOfTheRecords = await db
        .collection('shortUrls')
        .countDocuments({ sessionToken: preExistDummyToken });
      expect(restOfTheRecords).toBe(14);
    });

    it(`should return ${httpStatus.NO_CONTENT} delete bulk existing record by sessionToken`, async () => {
      const beforeDeleteCount = await db
        .collection('shortUrls')
        .countDocuments({ sessionToken: preExistDummyToken });
      expect(beforeDeleteCount).toBe(preExistData().length);

      await requestWithDummyCookie(routePath, 'delete')
        .send({ cleanAll: true })
        .expect(httpStatus.NO_CONTENT)
        .expect(async () => {
          const afterDeleteCount = await db
            .collection('shortUrls')
            .countDocuments({ sessionToken: preExistDummyToken });
          expect(afterDeleteCount).toBe(0);
        });
    });
  });

  describe('DELETE unhappy path', () => {
    it(`should return ${httpStatus.BAD_REQUEST} when cleanAll or id does not provided`, async () => {
      await requestWithDummyCookie(routePath, 'delete')
        .send({})
        .expect(httpStatus.BAD_REQUEST)
        .expect(({ body }) => {
          expect(body.error).toBe('"body" must contain at least one of [cleanAll, id]');
        });
    });

    it(`should return ${httpStatus.UNAUTHORIZED} when there is no token`, async () => {
      await requestWithoutCookie(routePath, 'delete')
        .expect(httpStatus.UNAUTHORIZED)
        .expect(({ body }) => {
          expect(body.error).toBe(
            '"body" must contain at least one of [cleanAll, id], "token" is required'
          );
        });

      await requestWithoutCookie(routePath, 'delete')
        .expect(httpStatus.UNAUTHORIZED)
        .send({ cleanAll: true })
        .expect(({ body }) => {
          expect(body.error).toBe('"token" is required');
        });

      await requestWithoutCookie(routePath, 'delete')
        .expect(httpStatus.UNAUTHORIZED)
        .send({ id: validObjectId })
        .expect(({ body }) => {
          expect(body.error).toBe('"token" is required');
        });
    });
  });
});
