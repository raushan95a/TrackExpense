import mongoose from 'mongoose';
import { NOTE_MAX_LENGTH, TRANSACTION_TYPE_VALUES } from '../constants/transaction.js';

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: TRANSACTION_TYPE_VALUES, required: true },
    // Integer minor units (paise/cents) to avoid floating-point errors.
    amount: {
      type: Number,
      required: true,
      min: 1,
      validate: { validator: Number.isInteger, message: 'Amount must be an integer' },
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    date: { type: Date, default: Date.now },
    note: { type: String, trim: true, maxlength: NOTE_MAX_LENGTH, default: '' },
  },
  { timestamps: true, versionKey: false },
);

transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, category: 1 });

export const Transaction = mongoose.model('Transaction', transactionSchema);
