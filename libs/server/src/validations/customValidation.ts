import { ObjectId } from 'mongodb';
import { validate, version } from 'uuid';

import { CustomHelpers, ErrorReport } from 'joi';

export const objectId = (value: string, helpers: CustomHelpers): ErrorReport | string => {
  if (!ObjectId.isValid(value)) {
    return helpers.message({ custom: `"${value}" must be a valid id` });
  }
  return value;
};

export const uuidId = (value: string, helpers: CustomHelpers): ErrorReport | string => {
  if (!validate(value) || version(value) !== 4) {
    return helpers.message({ custom: `"${value}" must be a valid token` });
  }
  return value;
};
