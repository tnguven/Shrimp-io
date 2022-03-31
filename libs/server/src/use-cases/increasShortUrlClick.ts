import { ShortUrlDb } from '@data-access';
import { makeShortUrl } from '@short-url';

export function makeIncreaseShortUrlClick({ shortUrlDb }: { shortUrlDb: ShortUrlDb }) {
  return async function increaseShortUrlClick(urlCode: string) {
    const existingShortUrl = await shortUrlDb.findByUrlCode(urlCode);

    if (existingShortUrl) {
      const shortUrl = makeShortUrl(existingShortUrl);
      await shortUrlDb.increaseClicks({
        id: existingShortUrl.id,
        expireAt: shortUrl.getExpireAt(),
      });
      return shortUrl.getLongUrl();
    }

    return undefined;
  };
}
