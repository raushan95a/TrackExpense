import { z } from 'zod';
import {
  CATEGORY_ICON_MAX_LENGTH,
  CATEGORY_NAME_MAX_LENGTH,
  HEX_COLOR_PATTERN,
} from '../constants/categories.js';
import { TRANSACTION_TYPES } from '../constants/transactions.js';

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(CATEGORY_NAME_MAX_LENGTH, `At most ${CATEGORY_NAME_MAX_LENGTH} characters`),
  type: z.enum(Object.values(TRANSACTION_TYPES)),
  icon: z.string().trim().max(CATEGORY_ICON_MAX_LENGTH, 'Icon is too long'),
  color: z.string().regex(HEX_COLOR_PATTERN, 'Pick a color'),
});
