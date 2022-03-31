import { ShortUrlDb } from '@data-access';
import { makeShortUrl } from '@short-url';
import { omit } from 'ramda';

export function makeAddShortUrl({ shortUrlDb }: { shortUrlDb: ShortUrlDb }) {
  return async function addShortUrl({ url, token }: Record<string, string>) {
    const existingUrl = await shortUrlDb.findByUrl(url);

    if (existingUrl) {
      return {
        shortUrl: omit(['sessionToken'], existingUrl),
        existingUrl: true,
      };
    }

    const shortUrlEntity = makeShortUrl({ url, sessionToken: token });
    const getUniqueShortUrl = async ({
      urlCode,
      shortUrl,
    }: {
      urlCode: string;
      shortUrl: string;
    }): Promise<ReturnType<typeof shortUrlEntity.regenerateUrlCode>> => {
      const existingShortUrl = await shortUrlDb.findByUrlCode(urlCode);
      if (!existingShortUrl) return { urlCode, shortUrl };
      return await getUniqueShortUrl(shortUrlEntity.regenerateUrlCode());
    };

    const { shortUrl, urlCode } = await getUniqueShortUrl({
      urlCode: shortUrlEntity.getUrlCode(),
      shortUrl: shortUrlEntity.getShortUrl(),
    });

    const savedDoc = await shortUrlDb.insert({
      url: shortUrlEntity.getLongUrl(),
      sessionToken: shortUrlEntity.getSessionToken(),
      shortUrl,
      urlCode,
      createdAt: shortUrlEntity.getCreatedAt(),
      expireAt: shortUrlEntity.getExpireAt(),
      clicks: shortUrlEntity.getClicks(),
    });

    return {
      shortUrl: omit(['sessionToken'], savedDoc),
      existingUrl: false,
    };
  };
}
