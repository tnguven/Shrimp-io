import { Router } from 'express';
import { EmptyObj } from 'types';
import { redirectShortUrl } from '@controllers';
import { validate } from '@middlewares/validate';
import { makeExpressCallback } from '@middlewares/expressCallback';
import { redirect } from '@validations/redirect';

export const router = Router({ mergeParams: true });

router
  .route('/')
  .get(
    validate(redirect),
    makeExpressCallback<EmptyObj, EmptyObj, EmptyObj, { urlCode: string }>(redirectShortUrl)
  );
