import { z } from 'zod';
import { NOTE_MAX_LENGTH, TRANSACTION_TYPES } from '../constants/transactions.js';
import { amountField } from './fields.js';

export const transactionSchema = z.object({
  type: z.enum(Object.values(TRANSACTION_TYPES)),
  amount: amountField(),
  category: z.string().min(1, 'Choose a category'),
  date: z.string().min(1, 'Date is required'),
  note: z.string().trim().max(NOTE_MAX_LENGTH, `At most ${NOTE_MAX_LENGTH} characters`),
});
