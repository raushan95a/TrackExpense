import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/** Signs a JWT carrying only the user id. */
export const generateToken = (userId) =>
  jwt.sign({ id: String(userId) }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export const verifyToken = (token) => jwt.verify(token, env.jwtSecret);
