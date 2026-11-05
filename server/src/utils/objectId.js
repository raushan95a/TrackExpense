import mongoose from 'mongoose';

/** Aggregation pipelines skip schema casting, so ids must be ObjectIds explicitly. */
export const toObjectId = (id) => new mongoose.Types.ObjectId(String(id));
