import mongoose from 'mongoose';
import { DB_STATES } from '../constants/app.js';

/** Reports process uptime and database connection state. */
export const getHealthStatus = () => ({
  status: 'ok',
  uptime: Math.round(process.uptime()),
  database: DB_STATES[mongoose.connection.readyState] ?? 'unknown',
  timestamp: new Date().toISOString(),
});
