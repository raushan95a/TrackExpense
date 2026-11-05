import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectDB, disconnectDB } from '../../src/config/db.js';

let mongod;

/** Starts an in-memory MongoDB and connects Mongoose to it. */
export const startTestDB = async () => {
  mongod = await MongoMemoryServer.create();
  await connectDB(mongod.getUri());
  await mongoose.connection.syncIndexes();
};

export const clearTestDB = async () => {
  const collections = Object.values(mongoose.connection.collections);
  await Promise.all(collections.map((collection) => collection.deleteMany({})));
};

export const stopTestDB = async () => {
  await disconnectDB();
  await mongod?.stop();
};
