import httpStatus from 'http-status';
import Joi, { ObjectSchema } from 'joi';
import { pick } from 'ramda';
import { Request, Response } from 'types';

export const validate =
  (schema: Record<string, ObjectSchema>) => (req: Request, res: Response, next: () => void) => {
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
        return res.status(httpStatus.UNAUTHORIZED).send({ error: sanitizedErrorMessages });
      }

      return res.status(httpStatus.BAD_REQUEST).send({ error: sanitizedErrorMessages });
    }

    Object.assign(req, value);
    return next();
  };
