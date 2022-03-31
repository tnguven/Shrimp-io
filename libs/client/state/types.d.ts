export interface ShortUrl {
  url: string;
  id: string;
  shortUrl: string;
  urlCode: string;
  createdAt: Date;
  expireAt: Date;
  clicks: number;
}
