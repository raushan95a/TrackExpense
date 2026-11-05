import { matchedData, validationResult } from 'express-validator';
import { MESSAGES } from '../constants/messages.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Runs express-validator chains, rejects with { field, msg } errors,
 * and replaces req.body / req.query with only the validated (and sanitised) fields.
 */
export const validate = (chains) => [
  ...chains,
  (req, _res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result
        .array({ onlyFirstError: true })
        .map(({ path, msg }) => ({ field: path, msg }));
      return next(ApiError.badRequest(MESSAGES.VALIDATION_FAILED, errors));
    }
    req.body = matchedData(req, { locations: ['body'] });
    req.query = matchedData(req, { locations: ['query'] });
    return next();
  },
];
