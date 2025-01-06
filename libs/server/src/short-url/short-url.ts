export type ShortUrl = {
  url: string;
  sessionToken: string;
  id: string;
  shortUrl: string;
  urlCode: string;
  createdAt: Date;
  expireAt: Date;
  clicks: number;
};

const getUTCDate = (d: Date) =>
  new Date(
    Date.UTC(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds()
    )
  );

export const getAddedDate = (d: Date, expiresWithIn: number) => {
  const expirationDate = getUTCDate(d);
  expirationDate.setDate(expirationDate.getDate() + expiresWithIn);
  return expirationDate;
};

const oneWeek = 7;

export function buildMakeShortUrl({
  idGenerator,
  getShortUrl,
  isValidId,
}: {
  idGenerator: () => string;
  getShortUrl: (id: string) => string;
  isValidId: (id: string | number | Buffer) => boolean;
}) {
  return function makeShortUrl(
    { url, sessionToken, ...rest }: Partial<ShortUrl>,
    expiresWithIn: number = oneWeek
  ) {
    if (!sessionToken) throw new Error('must have a valid sessionToken');
    if (!url) throw new Error('url must have a valid type');

    const isExistingShortUrl = Object.keys(rest).length > 0;
    if (isExistingShortUrl) {
      if (!rest?.urlCode) throw new Error('existing object must have a urlCode');
      if (!rest?.shortUrl) throw new Error('existing object must have a shortUrl');
      if (typeof rest?.clicks !== 'number')
        throw new Error('existing object must have valid clicks type');
      if (!rest.id) throw new Error('existing object must have a id');
      if (!isValidId(rest.id)) throw new Error('existing object must have a valid db id');
    }

    const generateUrlCodeAndUrl = () => {
      const urlId = idGenerator();
      return {
        shortUrl: getShortUrl(urlId),
        urlCode: urlId,
      };
    };

    const entity = {
      id: rest.id,
      url,
      sessionToken,
      ...(rest.shortUrl && rest.urlCode
        ? { shortUrl: rest.shortUrl, urlCode: rest.urlCode }
        : generateUrlCodeAndUrl()),
      createdAt: rest.createdAt || getUTCDate(new Date(Date.now())),
      expireAt: getAddedDate(new Date(Date.now()), expiresWithIn),
      clicks: rest.clicks || 0,
    };

    return <const>{
      getId: () => entity.id,
      getSessionToken: () => entity.sessionToken,
      getLongUrl: () => entity.url,
      getShortUrl: () => entity.shortUrl,
      getUrlCode: () => entity.urlCode,
      getCreatedAt: () => entity.createdAt,
      getExpireAt: () => entity.expireAt,
      getClicks: () => entity.clicks,
      getObj: () => entity,
      regenerateUrlCode: () => {
        const { shortUrl, urlCode } = generateUrlCodeAndUrl();
        entity.urlCode = urlCode;
        entity.shortUrl = shortUrl;
        return { shortUrl, urlCode };
      },
    };
  };
}
