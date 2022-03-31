import { MongoClient } from 'mongodb';
import { dataBase, mongoURI } from '@config';
import { Collections } from './collections';

const client = new MongoClient(mongoURI, {
  connectTimeoutMS: 6000,
  socketTimeoutMS: 50000,
  family: 4,
  maxPoolSize: 10,
});

export async function connectDb(): Promise<MongoClient> {
  const notTest = process.env.NODE_ENV !== 'test';
  try {
    await client.connect(); // connect will be cached internally
    notTest &&
      console.log('\x1b[92m', `\nCONNECTED TO [${dataBase.dbName}] database ✅\n`, '\x1b[0m');
    return client;
  } catch (err) {
    console.error(
      '\x1b[91m',
      `\nCONNECTION FAILED TO [${dataBase.dbName}] database ⛔\n`,
      '\x1b[0m'
    );
    throw err;
  }
}

export function getCollection<TSchema>(
  collection: typeof Collections[keyof typeof Collections],
  dbName: string = dataBase.dbName
) {
  return client.db(dbName).collection<TSchema>(collection);
}

export { MongoClient };
