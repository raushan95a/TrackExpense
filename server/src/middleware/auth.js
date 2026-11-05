import { BEARER_PREFIX } from '../constants/auth.js';
import { MESSAGES } from '../constants/messages.js';
import { findUserForAuth } from '../services/auth.service.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyToken } from '../utils/generateToken.js';

const extractToken = (header = '') =>
  header.startsWith(BEARER_PREFIX) ? header.slice(BEARER_PREFIX.length).trim() : null;

/** Verifies the Bearer JWT and attaches the user document to req.user. */
export const protect = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req.headers.authorization);
  if (!token) throw ApiError.unauthorized(MESSAGES.TOKEN_MISSING);

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw ApiError.unauthorized(MESSAGES.TOKEN_INVALID);
  }

  const user = await findUserForAuth(payload.id);
  if (!user || user.changedPasswordAfter(payload.iat)) {
    throw ApiError.unauthorized(MESSAGES.TOKEN_INVALID);
  }

  req.user = user;
  next();
});
