import mongoose from 'mongoose';
import { MONTH_PATTERN } from '../constants/date.js';

const budgetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    month: { type: String, required: true, match: MONTH_PATTERN },
    // Integer minor units, like transaction amounts.
    limit: {
      type: Number,
      required: true,
      min: 1,
      validate: { validator: Number.isInteger, message: 'Limit must be an integer' },
    },
  },
  { timestamps: true, versionKey: false },
);

budgetSchema.index({ user: 1, category: 1, month: 1 }, { unique: true });
budgetSchema.index({ user: 1, month: 1 });

export const Budget = mongoose.model('Budget', budgetSchema);
