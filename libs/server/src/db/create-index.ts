import { dataBase } from '../config';
import { Collections } from './collections';
import { connectDb } from './mongoDb';
import { logger } from '../logger/logger';

async function createIndexes() {
  const client = await connectDb();
  const db = client.db(dataBase.dbName);
  const ASCENDING = 1;

  return Promise.all([
    db
      .collection(Collections.ShortUrls)
      .createIndexes([{ key: { createdAt: ASCENDING }, background: true }]),
    db
      .collection(Collections.ShortUrls)
      .createIndexes([{ key: { sessionToken: 1 }, background: true }]),
    db
      .collection(Collections.ShortUrls)
      .createIndexes([{ key: { urlCode: 'text' }, background: true, unique: true }]),
  ]);
}

createIndexes()
  .then(logger.info)
  .catch(logger.error)
  .finally(() => {
    logger.info('Index creation success');
    process.exit(0);
  });
