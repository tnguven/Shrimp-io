import Joi from 'joi';

export const redirect = {
  params: Joi.object().keys({
    urlCode: Joi.string().alphanum().length(8).required(),
  }),
};
