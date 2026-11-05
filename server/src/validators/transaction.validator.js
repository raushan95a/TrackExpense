import { body, query } from 'express-validator';
import { MESSAGES } from '../constants/messages.js';
import { PAGINATION, SEARCH_MAX_LENGTH } from '../constants/pagination.js';
import { MAX_AMOUNT, NOTE_MAX_LENGTH, TRANSACTION_TYPE_VALUES } from '../constants/transaction.js';
import { idParamRule, typeQueryRule } from './common.validator.js';

const typeRule = () =>
  body('type')
    .isIn(TRANSACTION_TYPE_VALUES)
    .withMessage(`Type must be one of: ${TRANSACTION_TYPE_VALUES.join(', ')}`);

const amountRule = () =>
  body('amount')
    .isInt({ min: 1, max: MAX_AMOUNT })
    .withMessage('Amount must be a positive integer in minor units (e.g. paise)')
    .toInt();

const categoryRule = () => body('category').isMongoId().withMessage('A valid category is required');

const dateRule = () =>
  body('date').optional().isISO8601().withMessage('Date must be a valid ISO date').toDate();

const noteRule = () =>
  body('note')
    .optional()
    .isString()
    .trim()
    .isLength({ max: NOTE_MAX_LENGTH })
    .withMessage(`Note must be at most ${NOTE_MAX_LENGTH} characters`);

const filterRules = () => [
  query('from').optional().isISO8601().withMessage('from must be a valid ISO date'),
  query('to')
    .optional()
    .isISO8601()
    .withMessage('to must be a valid ISO date')
    .custom((to, { req }) => !req.query.from || new Date(to) >= new Date(req.query.from))
    .withMessage('to must be on or after from'),
  query('category').optional().isMongoId().withMessage(MESSAGES.INVALID_ID),
  typeQueryRule(),
  query('q')
    .optional()
    .isString()
    .trim()
    .isLength({ max: SEARCH_MAX_LENGTH })
    .withMessage(`Search must be at most ${SEARCH_MAX_LENGTH} characters`),
];

export const createTransactionRules = [
  typeRule(),
  amountRule(),
  categoryRule(),
  dateRule(),
  noteRule(),
];

export const updateTransactionRules = [
  idParamRule(),
  typeRule().optional(),
  amountRule().optional(),
  categoryRule().optional(),
  dateRule(),
  noteRule(),
];

export const listTransactionsRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be >= 1').toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: PAGINATION.MAX_LIMIT })
    .withMessage(`limit must be between 1 and ${PAGINATION.MAX_LIMIT}`)
    .toInt(),
  ...filterRules(),
];

export const exportTransactionsRules = filterRules();

export const transactionIdRules = [idParamRule()];
