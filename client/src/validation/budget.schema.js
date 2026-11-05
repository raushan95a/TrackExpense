import { z } from 'zod';
import { amountField } from './fields.js';

export const budgetSchema = z.object({
  category: z.string().min(1, 'Choose a category'),
  limit: amountField('Limit'),
});
