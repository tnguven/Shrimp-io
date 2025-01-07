import { NextFunction } from 'express';

import Joi, { ObjectSchema } from 'joi';
import { pick } from 'ramda';
import { Request, Response } from 'global';
import { UnauthorizedError, ValidationError } from 'errors/errors';

export const validate =
  (schema: Record<string, ObjectSchema>) => (req: Request, _res: Response, next: NextFunction) => {
    const validSchema = pick(['params', 'query', 'body', 'cookies'], schema);
    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: 'key' }, abortEarly: false })
      .validate(pick(Object.keys(validSchema), req));

    if (error) {
      const sanitizedErrorMessages = error.details
        .map(({ message }) => message.split(': /^').at(0))
        .join(', ')
        .trim();

      if (sanitizedErrorMessages.includes('token')) {
        return next(new UnauthorizedError(sanitizedErrorMessages));
      }
      return next(new ValidationError(sanitizedErrorMessages));
    }

    Object.assign(req, value);
    return next();
  };
