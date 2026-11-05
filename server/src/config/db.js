import mongoose from 'mongoose';
import { ENVIRONMENTS } from '../constants/app.js';
import { env } from './env.js';

mongoose.set('strictQuery', true);

/** Opens the MongoDB connection. Throws if the database is unreachable. */
export const connectDB = async (uri = env.mongoUri) => {
  const conn = await mongoose.connect(uri);
  if (env.nodeEnv !== ENVIRONMENTS.TEST) {
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  }
  return conn;
};

export const disconnectDB = () => mongoose.connection.close();
