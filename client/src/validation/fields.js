import { z } from 'zod';
import { MAX_AMOUNT_MAJOR } from '../constants/transactions.js';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_PATTERN,
} from '../constants/validation.js';

/** Positive number with at most two decimal places, e.g. "250" or "250.50". */
const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;

/** Money typed in major units; converted to minor units before sending. */
export const amountField = (label = 'Amount') =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .regex(AMOUNT_PATTERN, `Enter a valid ${label.toLowerCase()} (max 2 decimals)`)
    .refine((value) => Number(value) > 0, `${label} must be greater than 0`)
    .refine((value) => Number(value) <= MAX_AMOUNT_MAJOR, `${label} is too large`);

export const strongPasswordField = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `At least ${PASSWORD_MIN_LENGTH} characters`)
  .max(PASSWORD_MAX_LENGTH, `At most ${PASSWORD_MAX_LENGTH} characters`)
  .regex(PASSWORD_PATTERN, 'Include at least one letter and one number');
