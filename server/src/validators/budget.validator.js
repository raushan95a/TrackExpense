import { body } from 'express-validator';
import { MAX_AMOUNT } from '../constants/transaction.js';
import { idParamRule, monthBodyRule, monthQueryRule } from './common.validator.js';

export const listBudgetsRules = [monthQueryRule()];

export const upsertBudgetRules = [
  body('category').isMongoId().withMessage('A valid category is required'),
  monthBodyRule(),
  body('limit')
    .isInt({ min: 1, max: MAX_AMOUNT })
    .withMessage('Limit must be a positive integer in minor units (e.g. paise)')
    .toInt(),
];

export const deleteBudgetRules = [idParamRule()];
