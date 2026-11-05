import { TRANSACTION_TYPES } from './transaction.js';

const { EXPENSE, INCOME } = TRANSACTION_TYPES;

export const CATEGORY_NAME_MAX_LENGTH = 30;
export const CATEGORY_ICON_MAX_LENGTH = 16;
export const HEX_COLOR_PATTERN = /^#(?:[0-9a-f]{3}){1,2}$/i;
export const DEFAULT_CATEGORY_COLOR = '#64748b';

/** Case-insensitive comparison for category names. */
export const CASE_INSENSITIVE_COLLATION = Object.freeze({ locale: 'en', strength: 2 });

/**
 * System categories available to every user (stored with user: null).
 * Colors are a colorblind-validated categorical palette; "Other" is neutral gray.
 */
export const DEFAULT_CATEGORIES = Object.freeze([
  { name: 'Food', type: EXPENSE, icon: '🍔', color: '#eb6834' },
  { name: 'Transport', type: EXPENSE, icon: '🚌', color: '#2a78d6' },
  { name: 'Rent', type: EXPENSE, icon: '🏠', color: '#6250d6' },
  { name: 'Bills', type: EXPENSE, icon: '💡', color: '#eda100' },
  { name: 'Shopping', type: EXPENSE, icon: '🛍️', color: '#e87ba4' },
  { name: 'Health', type: EXPENSE, icon: '💊', color: '#e34948' },
  { name: 'Entertainment', type: EXPENSE, icon: '🎬', color: '#1baf7a' },
  { name: 'Other', type: EXPENSE, icon: '📦', color: '#8a8984' },
  { name: 'Salary', type: INCOME, icon: '💰', color: '#008300' },
  { name: 'Other', type: INCOME, icon: '💵', color: '#8a8984' },
]);
