import { ObjectId } from 'mongodb';
import { CollectionType } from '@db/collections';
import { ShortUrlModel, CreatedShortUrl, ShortUrlCol } from '@data-access';

export type ShortUrlColGetter = (c: CollectionType) => ShortUrlCol;

const transformId = ({ _id, ...rest }: ShortUrlModel) => ({
  id: _id.toString(),
  ...rest,
});

export function makeShortUrlDb({ getCollection }: { getCollection: ShortUrlColGetter }) {
  async function findAll({
    limit,
    lastId,
    sessionToken,
  }: {
    sessionToken: string;
    limit: number;
    lastId?: string;
  }) {
    const query = {
      sessionToken,
      ...(lastId && { _id: { $lt: new ObjectId(lastId) } }),
    };

    const result = await getCollection('shortUrls')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
    return result.map(transformId);
  }

  async function insert(shortUrl: CreatedShortUrl) {
    const { insertedId } = await getCollection('shortUrls').insertOne({ ...shortUrl });
    return { ...shortUrl, id: insertedId.toString() };
  }

  async function findByUrlCode(urlCode: CreatedShortUrl['shortUrl']) {
    const result = await getCollection('shortUrls').findOne({ urlCode });
    return result && transformId(result);
  }

  async function findByUrl(url: CreatedShortUrl['url']) {
    const result = await getCollection('shortUrls').findOne({ url });
    return result && transformId(result);
  }

  async function findById(id: string) {
    const result = await getCollection('shortUrls').findOne({ _id: new ObjectId(id) });
    return result && transformId(result);
  }

  async function increaseClicks({ id, expireAt }: { id: string | ObjectId; expireAt: Date }) {
    return getCollection('shortUrls').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { expireAt },
        $inc: { clicks: 1 },
      }
    );
  }

  async function removeByIdAndSessionToken({
    id,
    sessionToken,
  }: {
    id: string;
    sessionToken: string;
  }) {
    const { deletedCount } = await getCollection('shortUrls').deleteOne({
      _id: new ObjectId(id),
      sessionToken,
    });
    return deletedCount;
  }

  async function removeBySessionToken(sessionToken: string) {
    const { deletedCount } = await getCollection('shortUrls').deleteMany({ sessionToken });
    return deletedCount;
  }

  return <const>{
    findAll,
    findByUrl,
    findByUrlCode,
    findById,
    insert,
    increaseClicks,
    removeByIdAndSessionToken,
    removeBySessionToken,
  };
}
