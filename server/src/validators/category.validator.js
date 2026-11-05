import { body } from 'express-validator';
import {
  CATEGORY_ICON_MAX_LENGTH,
  CATEGORY_NAME_MAX_LENGTH,
  HEX_COLOR_PATTERN,
} from '../constants/category.js';
import { TRANSACTION_TYPE_VALUES } from '../constants/transaction.js';
import { idParamRule, typeQueryRule } from './common.validator.js';

const nameRule = () =>
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: CATEGORY_NAME_MAX_LENGTH })
    .withMessage(`Name must be at most ${CATEGORY_NAME_MAX_LENGTH} characters`);

const typeRule = () =>
  body('type')
    .isIn(TRANSACTION_TYPE_VALUES)
    .withMessage(`Type must be one of: ${TRANSACTION_TYPE_VALUES.join(', ')}`);

const iconRule = () =>
  body('icon')
    .optional()
    .trim()
    .isLength({ max: CATEGORY_ICON_MAX_LENGTH })
    .withMessage(`Icon must be at most ${CATEGORY_ICON_MAX_LENGTH} characters`);

const colorRule = () =>
  body('color')
    .optional()
    .matches(HEX_COLOR_PATTERN)
    .withMessage('Color must be a hex value like #22c55e');

export const listCategoriesRules = [typeQueryRule()];

export const createCategoryRules = [nameRule(), typeRule(), iconRule(), colorRule()];

export const updateCategoryRules = [
  idParamRule(),
  nameRule().optional(),
  typeRule().optional(),
  iconRule(),
  colorRule(),
];

export const deleteCategoryRules = [idParamRule()];
