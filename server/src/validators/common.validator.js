import { param, query } from 'express-validator';
import { MESSAGES } from '../constants/messages.js';
import { TRANSACTION_TYPE_VALUES } from '../constants/transaction.js';

export const idParamRule = () => param('id').isMongoId().withMessage(MESSAGES.INVALID_ID);

export const typeQueryRule = () =>
  query('type')
    .optional()
    .isIn(TRANSACTION_TYPE_VALUES)
    .withMessage(`Type must be one of: ${TRANSACTION_TYPE_VALUES.join(', ')}`);
