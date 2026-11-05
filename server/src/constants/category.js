import { TRANSACTION_TYPES } from './transaction.js';

const { EXPENSE, INCOME } = TRANSACTION_TYPES;

export const CATEGORY_NAME_MAX_LENGTH = 30;
export const CATEGORY_ICON_MAX_LENGTH = 16;
export const HEX_COLOR_PATTERN = /^#(?:[0-9a-f]{3}){1,2}$/i;
export const DEFAULT_CATEGORY_COLOR = '#64748b';

/** Case-insensitive comparison for category names. */
export const CASE_INSENSITIVE_COLLATION = Object.freeze({ locale: 'en', strength: 2 });

/** System categories available to every user (stored with user: null). */
export const DEFAULT_CATEGORIES = Object.freeze([
  { name: 'Food', type: EXPENSE, icon: '🍔', color: '#f97316' },
  { name: 'Transport', type: EXPENSE, icon: '🚌', color: '#0ea5e9' },
  { name: 'Rent', type: EXPENSE, icon: '🏠', color: '#8b5cf6' },
  { name: 'Bills', type: EXPENSE, icon: '💡', color: '#eab308' },
  { name: 'Shopping', type: EXPENSE, icon: '🛍️', color: '#ec4899' },
  { name: 'Health', type: EXPENSE, icon: '💊', color: '#ef4444' },
  { name: 'Entertainment', type: EXPENSE, icon: '🎬', color: '#14b8a6' },
  { name: 'Other', type: EXPENSE, icon: '📦', color: '#64748b' },
  { name: 'Salary', type: INCOME, icon: '💰', color: '#22c55e' },
  { name: 'Other', type: INCOME, icon: '💵', color: '#84cc16' },
]);
