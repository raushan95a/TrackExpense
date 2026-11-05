import { z } from 'zod';
import { MAX_AMOUNT_MAJOR, NOTE_MAX_LENGTH, TRANSACTION_TYPES } from '../constants/transactions.js';

/** Positive number with at most two decimal places, e.g. "250" or "250.50". */
const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;

export const transactionSchema = z.object({
  type: z.enum(Object.values(TRANSACTION_TYPES)),
  amount: z
    .string()
    .trim()
    .min(1, 'Amount is required')
    .regex(AMOUNT_PATTERN, 'Enter a valid amount (max 2 decimals)')
    .refine((value) => Number(value) > 0, 'Amount must be greater than 0')
    .refine((value) => Number(value) <= MAX_AMOUNT_MAJOR, 'Amount is too large'),
  category: z.string().min(1, 'Choose a category'),
  date: z.string().min(1, 'Date is required'),
  note: z.string().trim().max(NOTE_MAX_LENGTH, `At most ${NOTE_MAX_LENGTH} characters`),
});
