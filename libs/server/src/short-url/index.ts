import { ObjectId } from 'mongodb';
import { server } from '@config';
import { generateRandomId } from '@utils/generateRandomId';
import { buildMakeShortUrl, ShortUrl } from './shortUrl';

const URL_ALPHABET = '0123456789abcdefghikmnopqrstvcyz' as const;
const ID_SIZE = 8;

export const getShortUrl = (urlCode: string) => `${server.DOMAIN}/${urlCode}`;
export const isValidId = (id: string | number | Buffer) => ObjectId.isValid(id);

export const makeShortUrl = buildMakeShortUrl({
  idGenerator: generateRandomId(URL_ALPHABET, ID_SIZE),
  getShortUrl,
  isValidId,
});

export { ShortUrl };
