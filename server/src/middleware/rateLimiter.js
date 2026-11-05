import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { ENVIRONMENTS } from '../constants/app.js';
import { AUTH_RATE_LIMIT, CREDENTIALS_RATE_LIMIT } from '../constants/auth.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';

/** Builds a limiter that answers in the standard error envelope (disabled in tests). */
const createLimiter = ({ WINDOW_MS, MAX_REQUESTS }) =>
  rateLimit({
    windowMs: WINDOW_MS,
    limit: MAX_REQUESTS,
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

/** Applied to every /auth route. */
export const authLimiter = createLimiter(AUTH_RATE_LIMIT);

/** Brute-force protection for register, login and password change. */
export const credentialsLimiter = createLimiter(CREDENTIALS_RATE_LIMIT);
