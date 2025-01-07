import { Express } from 'express';
import express from 'express';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import compression from 'compression';
import cookie from 'cookie-parser';

import { Cookies as setCookies } from '@middlewares/cookies';
import { router as routes } from '@routes/main-route';
import { router as redirectRoute } from '@routes/redirect-route';
import { makeErrorHandler } from '@middlewares/error-handler';
import { httpLogger } from 'logger/logger';

export const app: Express = express();

app.use(httpLogger)
app.use(cors());
app.use(helmet());
app.use(cookie());
app.use(setCookies);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(compression());
app.use(makeErrorHandler());

app.use('/v1', routes);
app.use('/:urlCode', redirectRoute);
