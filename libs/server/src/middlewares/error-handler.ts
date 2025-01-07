import { NextFunction } from 'express';
import httpStatus from 'http-status';
import { Request, Response } from 'global';
import Joi from 'joi';
import { AppError } from 'errors/errors';

export function makeErrorHandler() {
  return async function errorHandler(
    err: Error | Joi.ValidationError,
    req: Request,
    res: Response,
    _next: NextFunction
  ) {
    req.log.error(err.stack);

    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        error: err.message,
        statusCode: err.statusCode,
      });
    }

    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Something went wrong!', status: httpStatus.INTERNAL_SERVER_ERROR });
  };
}
