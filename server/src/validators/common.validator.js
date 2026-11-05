import { body, param, query } from 'express-validator';
import { MONTH_PATTERN } from '../constants/date.js';
import { MESSAGES } from '../constants/messages.js';
import { TRANSACTION_TYPE_VALUES } from '../constants/transaction.js';

const MONTH_MESSAGE = 'Month must be in YYYY-MM format';

export const idParamRule = () => param('id').isMongoId().withMessage(MESSAGES.INVALID_ID);

export const typeQueryRule = () =>
  query('type')
    .optional()
    .isIn(TRANSACTION_TYPE_VALUES)
    .withMessage(`Type must be one of: ${TRANSACTION_TYPE_VALUES.join(', ')}`);

export const monthQueryRule = () =>
  query('month').optional().matches(MONTH_PATTERN).withMessage(MONTH_MESSAGE);

export const monthBodyRule = () => body('month').matches(MONTH_PATTERN).withMessage(MONTH_MESSAGE);
