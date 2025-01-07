import { Router, IRouter } from 'express';
import { EmptyObj } from 'global';
import { redirectShortUrl } from '@controllers';
import { validate } from '@middlewares/validate';
import { makeExpressCallback } from '@middlewares/express-callback';
import { redirect } from '@validations/redirect';

export const router: IRouter = Router({ mergeParams: true });

router
  .route('/')
  .get(
    validate(redirect),
    makeExpressCallback<EmptyObj, EmptyObj, EmptyObj, { urlCode: string }>(redirectShortUrl)
  );
