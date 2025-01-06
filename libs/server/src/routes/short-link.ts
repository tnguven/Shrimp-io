import { Router, Router as ExpressRouter } from 'express';
import { EmptyObj } from 'global';
import { getShortenedUrls, insertShortUrl, removeUrl } from '@controllers';
import { postLink, deleteUrls, getShortenedLinks } from '@validations/shortUrl';
import { validate } from '@middlewares/validate';

import { makeExpressCallback } from '@middlewares/express-callback';

export const router: ExpressRouter = Router();

router
  .route('/')
  .get(
    validate(getShortenedLinks),
    makeExpressCallback<EmptyObj, { token: string }, { limit?: string; lastId?: string }>(
      getShortenedUrls
    )
  )
  .post(validate(postLink), makeExpressCallback<{ url: string }, { token: string }>(insertShortUrl))
  .delete(
    validate(deleteUrls),
    makeExpressCallback<{ cleanAll?: boolean; id?: string }, { token: string }>(removeUrl)
  );
