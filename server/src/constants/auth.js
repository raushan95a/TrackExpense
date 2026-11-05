export const BCRYPT_SALT_ROUNDS = 12;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
/** At least one letter and one digit. */
export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).+$/;

export const NAME_MAX_LENGTH = 50;

export const BEARER_PREFIX = 'Bearer ';

export const AUTH_RATE_LIMIT = Object.freeze({
  WINDOW_MS: 15 * 60 * 1000,
  MAX_REQUESTS: 10,
});
