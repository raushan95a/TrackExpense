export const API_PREFIX = '/api/v1';

export const BODY_SIZE_LIMIT = '10kb';

export const ENVIRONMENTS = Object.freeze({
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
});

/** Human-readable names for mongoose.connection.readyState values. */
export const DB_STATES = Object.freeze([
  'disconnected',
  'connected',
  'connecting',
  'disconnecting',
]);
