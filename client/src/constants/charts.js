import { TRANSACTION_TYPES } from './transactions.js';

/**
 * Series colors validated for colorblind separation and 3:1 contrast
 * (blue/orange from the categorical palette). Category charts use each
 * category's own color instead, so a category keeps its color everywhere.
 */
export const SERIES_COLORS = Object.freeze({
  [TRANSACTION_TYPES.INCOME]: '#2a78d6',
  [TRANSACTION_TYPES.EXPENSE]: '#eb6834',
});

/** Neutral color for the folded "Other" slice. */
export const OTHER_COLOR = '#8a8984';

/** Recessive chart chrome. */
export const CHART_THEME = Object.freeze({
  surface: '#ffffff',
  grid: '#e2e8f0',
  axisText: '#64748b',
  cursor: '#f1f5f9',
});

/** Donut shows at most this many slices; the rest fold into "Other". */
export const MAX_PIE_SLICES = 6;

export const RECENT_TRANSACTIONS_LIMIT = 5;
