import { Router } from 'express';

import { router as shortLink } from './shortLink';

export const router = Router();

router.use('/shorten', shortLink);
