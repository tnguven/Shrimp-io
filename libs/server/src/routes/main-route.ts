import { Router, Router as ExpressRouter } from 'express';

import { router as shortLink } from './short-link';

export const router: ExpressRouter = Router();

router.use('/shorten', shortLink);
