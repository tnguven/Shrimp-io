import httpStatus from 'http-status';
import { MongoClient, Db } from 'mongodb';
import { requestWithDummyCookie, preExistData, preExistDummyToken } from './tools';
import { connectDb } from '../src/db/mongoDb';

describe('GET /:urlCode - redirect endpoint', () => {
  const routePath = '/';
  let connection: MongoClient;
  let db: Db;

  beforeAll(async () => {
    connection = await connectDb();
    db = connection.db(process.env.MONGO_DATABASE);
    await db.collection('shortUrls').insertMany(preExistData());
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

  describe('REDIRECT happy path', () => {
    const [first] = preExistData();

    it(`should return ${httpStatus.FOUND} redirect record and increase clicks field on db`, async () => {
      await requestWithDummyCookie(`${routePath}${first.urlCode}`, 'get')
        .expect(httpStatus.FOUND)
        .expect(async ({ text, redirect }) => {
          expect(redirect).toBe(true);
          expect(text.includes(first.url)).toBe(true);
          const url = await db.collection('shortUrls').findOne({ shortUrl: first.shortUrl });
          expect(url?.clicks).toBe(1);
        });
    });
  });

  describe('REDIRECT unhappy path', () => {
    it(`should return ${httpStatus.FOUND} and redirect /404 when param is valid but does not exist`, async () => {
      await requestWithDummyCookie(`${routePath}12345678`, 'get')
        .expect(httpStatus.FOUND)
        .expect(({ text, redirect }) => {
          expect(redirect).toBe(true);
          expect(text).toBe('Found. Redirecting to /404');
        });
    });
  });
});
