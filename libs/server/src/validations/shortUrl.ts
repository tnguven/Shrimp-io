import Joi from 'joi';
import { objectId, uuidId } from './customValidation';

export const isValidURL =
  /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

const token = Joi.string().custom(uuidId).required();

export const getShortenedLinks = {
  query: Joi.object().keys({
    lastId: Joi.string().custom(objectId).optional(),
    limit: Joi.number().positive().integer().max(50).optional(),
  }),
  cookies: Joi.object().keys({ token }).options({ stripUnknown: true }),
};

export const deleteUrls = {
  body: Joi.object()
    .keys({ cleanAll: Joi.boolean(), id: Joi.custom(objectId) })
    .xor('cleanAll', 'id'),
  cookies: Joi.object().keys({ token }).options({ stripUnknown: true }),
};

export const postLink = {
  body: Joi.object().keys({ url: Joi.string().uri().regex(isValidURL).required() }),
  cookies: Joi.object().keys({ token }).options({ stripUnknown: true }),
};
