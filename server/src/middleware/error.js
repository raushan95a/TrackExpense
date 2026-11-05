import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { ENVIRONMENTS } from '../constants/app.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';
import { ApiError } from '../utils/ApiError.js';

const MONGO_DUPLICATE_KEY = 11000;

/** Maps known library errors to ApiError; returns null for unknown errors. */
const normalizeError = (err) => {
  if (err instanceof ApiError) return err;

  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({ field: e.path, msg: e.message }));
    return ApiError.badRequest(MESSAGES.VALIDATION_FAILED, errors);
  }
  if (err instanceof mongoose.Error.CastError) {
    return ApiError.badRequest(MESSAGES.INVALID_ID, [
      { field: err.path, msg: MESSAGES.INVALID_ID },
    ]);
  }
  if (err.code === MONGO_DUPLICATE_KEY) {
    const errors = Object.keys(err.keyValue || {}).map((field) => ({
      field,
      msg: `${field} already exists`,
    }));
    return ApiError.conflict(MESSAGES.DUPLICATE_KEY, errors);
  }
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return ApiError.unauthorized(MESSAGES.UNAUTHORIZED);
  }
  if (err.type === 'entity.parse.failed') return ApiError.badRequest(MESSAGES.INVALID_JSON);
  if (err.type === 'entity.too.large') {
    return new ApiError(HTTP_STATUS.PAYLOAD_TOO_LARGE, MESSAGES.PAYLOAD_TOO_LARGE);
  }
  return null;
};

// Express identifies error middleware by its 4-argument signature.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const apiError = normalizeError(err);

  if (!apiError && env.nodeEnv !== ENVIRONMENTS.TEST) {
    console.error(err);
  }

  const statusCode = apiError?.statusCode ?? HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const body = {
    success: false,
    message: apiError?.message ?? MESSAGES.INTERNAL_ERROR,
    errors: apiError?.errors ?? [],
  };
  if (!apiError && env.nodeEnv === ENVIRONMENTS.DEVELOPMENT) body.stack = err.stack;

  res.status(statusCode).json(body);
};
