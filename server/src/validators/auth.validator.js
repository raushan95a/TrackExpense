import { body } from 'express-validator';
import {
  NAME_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_PATTERN,
} from '../constants/auth.js';
import { SUPPORTED_CURRENCIES } from '../constants/currency.js';

const nameRule = () =>
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: NAME_MAX_LENGTH })
    .withMessage(`Name must be at most ${NAME_MAX_LENGTH} characters`);

const emailRule = () =>
  body('email').trim().toLowerCase().isEmail().withMessage('A valid email is required');

const strongPasswordRule = (field) =>
  body(field)
    .isString()
    .isLength({ min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH })
    .withMessage(`Password must be ${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} characters`)
    .matches(PASSWORD_PATTERN)
    .withMessage('Password must contain at least one letter and one number');

const requiredString = (field, label) =>
  body(field).isString().notEmpty().withMessage(`${label} is required`);

export const registerRules = [nameRule(), emailRule(), strongPasswordRule('password')];

export const loginRules = [emailRule(), requiredString('password', 'Password')];

export const updateProfileRules = [
  nameRule().optional(),
  body('currency')
    .optional()
    .trim()
    .toUpperCase()
    .isIn(SUPPORTED_CURRENCIES)
    .withMessage(`Currency must be one of: ${SUPPORTED_CURRENCIES.join(', ')}`),
];

export const changePasswordRules = [
  requiredString('currentPassword', 'Current password'),
  strongPasswordRule('newPassword')
    .custom((value, { req }) => value !== req.body.currentPassword)
    .withMessage('New password must differ from the current password'),
];
