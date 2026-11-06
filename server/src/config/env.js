import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const REQUIRED_VARS = ['MONGO_URI', 'JWT_SECRET'];

const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
if (missing.length) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

/** Validated, typed and frozen application configuration. */
export const env = Object.freeze({
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrls: (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean),
  nodeEnv: process.env.NODE_ENV || 'development',
  // Number of reverse proxies in front of the app (e.g. 1 on Render/Railway) so
  // rate limiting sees the real client IP. 0 = trust none (local development).
  trustProxy: Number(process.env.TRUST_PROXY) || 0,
});
