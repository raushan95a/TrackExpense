import { query } from 'express-validator';
import { YEAR_RANGE } from '../constants/date.js';
import { monthQueryRule, typeQueryRule } from './common.validator.js';

export const summaryRules = [monthQueryRule()];

export const byCategoryRules = [monthQueryRule(), typeQueryRule()];

export const monthlyRules = [
  query('year')
    .optional()
    .isInt({ min: YEAR_RANGE.MIN, max: YEAR_RANGE.MAX })
    .withMessage(`Year must be between ${YEAR_RANGE.MIN} and ${YEAR_RANGE.MAX}`)
    .toInt(),
];
