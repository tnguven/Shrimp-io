import { MongoClient, Db, ObjectId } from 'mongodb';
import { makeShortUrlDb } from './shortUrlDb';
import { CollectionType } from '../db/collections';

const preExistData = [
  {
    sessionToken: 'e8b15e19-16f2-4b03-8279-847b503cb14c',
    createdAt: '2022-03-27T12:00:50.318Z',
    expireAt: '2022-04-10T12:00:50.318Z',
    clicks: 0,
    url: 'https://test.url/test1',
    shortUrl: 'http://test-env.com/abcd1000',
    urlCode: 'abcd1000',
  },
  {
    sessionToken: 'e8b15e19-16f2-4b03-8279-847b503cb14c',
    createdAt: '2022-03-27T13:00:50.318Z',
    expireAt: '2022-04-10T12:00:50.318Z',
    clicks: 0,
    url: 'https://test.url/test2',
    shortUrl: 'http://test-env.com/abcd1001',
    urlCode: 'abcd1001',
  },
  {
    sessionToken: 'e8b15e19-16f2-4b03-8279-847b503cb14c',
    createdAt: '2022-03-27T14:00:50.318Z',
    expireAt: '2022-04-10T12:00:50.318Z',
    clicks: 0,
    url: 'https://test.url/test3',
    shortUrl: 'http://test-env.com/abcd1002',
    urlCode: 'abcd1002',
  },
  {
    sessionToken: 'e8b15e19-16f2-4b03-8279-847b503cb14c',
    createdAt: '2022-03-27T15:00:50.318Z',
    expireAt: '2022-04-10T12:00:50.318Z',
    clicks: 0,
    url: 'https://test.url/test4',
    shortUrl: 'http://test-env.com/abcd1003',
    urlCode: 'abcd1003',
  },
] as const;

describe('ShortUrls data access', () => {
  let connection: MongoClient;
  let db: Db;
  let shortUrlDb: ReturnType<typeof makeShortUrlDb>;
  const dbName = process.env.MONGO_DATABASE || '';

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL || '');
    db = connection.db(dbName);
    shortUrlDb = makeShortUrlDb({
      getCollection: (c: CollectionType) => connection.db(dbName).collection(c),
    });
  });

  afterAll(async () => {
    await db.collection('shortUrls').drop();
    await connection.close();
  });

  beforeEach(async () => {
    await db.collection('shortUrls').insertMany([...preExistData.map((i) => ({ ...i }))]);
  });

  afterEach(async () => {
    await db.collection('shortUrls').deleteMany({});
  });

  it('should find all descending order', async () => {
    const result = await shortUrlDb.findAll({
      limit: 2,
      sessionToken: 'e8b15e19-16f2-4b03-8279-847b503cb14c',
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const resultWithoutID = result.map(({ id, ...rest }) => rest);
    expect(resultWithoutID).toEqual([
      {
        sessionToken: 'e8b15e19-16f2-4b03-8279-847b503cb14c',
        createdAt: '2022-03-27T15:00:50.318Z',
        expireAt: '2022-04-10T12:00:50.318Z',
        clicks: 0,
        url: 'https://test.url/test4',
        shortUrl: 'http://test-env.com/abcd1003',
        urlCode: 'abcd1003',
      },
      {
        sessionToken: 'e8b15e19-16f2-4b03-8279-847b503cb14c',
        createdAt: '2022-03-27T14:00:50.318Z',
        expireAt: '2022-04-10T12:00:50.318Z',
        clicks: 0,
        url: 'https://test.url/test3',
        shortUrl: 'http://test-env.com/abcd1002',
        urlCode: 'abcd1002',
      },
    ]);
  });

  it('should paginate descending order', async () => {
    const [{ id, ...latestRecord }] = await shortUrlDb.findAll({
      limit: 1,
      sessionToken: 'e8b15e19-16f2-4b03-8279-847b503cb14c',
    });
    expect(latestRecord).toEqual({
      sessionToken: 'e8b15e19-16f2-4b03-8279-847b503cb14c',
      createdAt: '2022-03-27T15:00:50.318Z',
      expireAt: '2022-04-10T12:00:50.318Z',
      clicks: 0,
      url: 'https://test.url/test4',
      shortUrl: 'http://test-env.com/abcd1003',
      urlCode: 'abcd1003',
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [{ id: nextId, ...nextRecord }] = await shortUrlDb.findAll({
      limit: 1,
      lastId: id,
      sessionToken: 'e8b15e19-16f2-4b03-8279-847b503cb14c',
    });
    expect(nextRecord).toEqual({
      sessionToken: 'e8b15e19-16f2-4b03-8279-847b503cb14c',
      createdAt: '2022-03-27T14:00:50.318Z',
      expireAt: '2022-04-10T12:00:50.318Z',
      clicks: 0,
      url: 'https://test.url/test3',
      shortUrl: 'http://test-env.com/abcd1002',
      urlCode: 'abcd1002',
    });
  });

  it('should findByUrlCode', async () => {
    for await (const item of preExistData) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...result } = (await shortUrlDb.findByUrlCode(item.urlCode)) || {};
      expect(result).toEqual(item);
    }
  });

  it('should findByUrl', async () => {
    for await (const item of preExistData) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...result } = (await shortUrlDb.findByUrl(item.url)) || {};
      expect(result).toEqual(item);
    }
  });

  it('should findById', async () => {
    const savedRecords = await db.collection('shortUrls').find({}).toArray();
    for await (const { _id, ...item } of savedRecords) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...result } = (await shortUrlDb.findById(_id.toString())) || {};
      expect(result).toEqual(item);
    }
  });

  it('should increaseClicks with new expireAt date', async () => {
    const now = new Date();
    const nextDay = new Date(now);
    nextDay.setDate(nextDay.getDate() + 1);

    const selectedUrl = await db.collection('shortUrls').findOne();
    const collectionId = selectedUrl?._id as unknown as ObjectId;
    await shortUrlDb.increaseClicks({ id: collectionId, expireAt: now });
    const firstUpdate = await db.collection('shortUrls').findOne({ _id: collectionId });
    expect(firstUpdate?.clicks).toBe(1);
    expect(firstUpdate?.expireAt.toISOString()).toBe(now.toISOString());

    await shortUrlDb.increaseClicks({ id: collectionId, expireAt: nextDay });
    const lastUpdate = await db.collection('shortUrls').findOne({ _id: collectionId });
    expect(lastUpdate?.clicks).toBe(2);
    expect(lastUpdate?.expireAt.toISOString()).toBe(nextDay.toISOString());
  });

  it('should removeByIdAndSessionToken', async () => {
    const selectedUrl = await db.collection('shortUrls').findOne();
    const result = await shortUrlDb.removeByIdAndSessionToken({
      id: selectedUrl?._id.toString() as unknown as string,
      sessionToken: selectedUrl?.sessionToken as unknown as string,
    });
    expect(result).toEqual(1);
    const removedRecord = await db.collection('shortUrls').findOne({ _id: selectedUrl?._id });
    expect(removedRecord).toBe(null);
  });

  it('should removeBySessionToken', async () => {
    const savedRecordsCount = await db.collection('shortUrls').countDocuments();
    expect(savedRecordsCount).toBe(preExistData.length);
    const result = await shortUrlDb.removeBySessionToken(preExistData[0].sessionToken);
    expect(result).toEqual(4);
    const afterDeleteRecordCount = await db.collection('shortUrls').countDocuments();
    expect(afterDeleteRecordCount).toEqual(0);
  });

  it('should insert', async () => {
    const now = new Date();
    const { id, ...record } = await shortUrlDb.insert({
      sessionToken: 'e8b15e19-16f2-4b03-8279-847b503cb14c',
      createdAt: now,
      expireAt: now,
      clicks: 0,
      url: 'https://first-insertion/record',
      shortUrl: 'http://test-env.com/abcd1004',
      urlCode: 'abcd1004',
    });
    expect(typeof id).toBe('string');
    expect(record).toEqual({
      sessionToken: 'e8b15e19-16f2-4b03-8279-847b503cb14c',
      createdAt: now,
      expireAt: now,
      clicks: 0,
      url: 'https://first-insertion/record',
      shortUrl: 'http://test-env.com/abcd1004',
      urlCode: 'abcd1004',
    });
    const newSavedRecords = await db
      .collection('shortUrls')
      .find({ _id: new ObjectId(id) })
      .toArray();
    expect(newSavedRecords.length).toBe(1);
  });
});
