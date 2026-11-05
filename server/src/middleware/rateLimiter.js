import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { ENVIRONMENTS } from '../constants/app.js';
import { AUTH_RATE_LIMIT } from '../constants/auth.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';

/** Brute-force protection for credential endpoints (disabled in tests). */
export const authLimiter = rateLimit({
  windowMs: AUTH_RATE_LIMIT.WINDOW_MS,
  limit: AUTH_RATE_LIMIT.MAX_REQUESTS,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: () => env.nodeEnv === ENVIRONMENTS.TEST,
  handler: (_req, res) =>
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      message: MESSAGES.TOO_MANY_REQUESTS,
      errors: [],
    }),
});
