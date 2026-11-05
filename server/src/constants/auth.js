export const BCRYPT_SALT_ROUNDS = 12;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
/** At least one letter and one digit. */
export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).+$/;

export const NAME_MAX_LENGTH = 50;

export const BEARER_PREFIX = 'Bearer ';

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

/** Strict limit for credential endpoints (register, login, password). */
export const CREDENTIALS_RATE_LIMIT = Object.freeze({
  WINDOW_MS: RATE_LIMIT_WINDOW_MS,
  MAX_REQUESTS: 10,
});

/** Looser limit for the rest of /auth (me, profile), called on every page load. */
export const AUTH_RATE_LIMIT = Object.freeze({
  WINDOW_MS: RATE_LIMIT_WINDOW_MS,
  MAX_REQUESTS: 100,
});
