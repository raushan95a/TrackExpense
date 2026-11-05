import { MESSAGES } from '../constants/messages.js';
import { ApiError } from '../utils/ApiError.js';

export const notFound = (req, res, next) => {
  next(ApiError.notFound(`${MESSAGES.ROUTE_NOT_FOUND}: ${req.method} ${req.originalUrl}`));
};
