import express from 'express';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import compression from 'compression';
import cookie from 'cookie-parser';

import { Cookies as setCookies } from '@middlewares/cookies';
import { router as routes } from '@routes/mainRoute';
import { router as redirectRoute } from '@routes/redirectRoute';

export const app = express();

app.use(cors());
app.use(helmet());
app.use(cookie());
app.use(setCookies);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(compression());

app.use('/v1', routes);
app.use('/:urlCode', redirectRoute);
