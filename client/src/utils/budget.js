import { BUDGET_STATUS, BUDGET_WARNING_PERCENT } from '../constants/budgets.js';

/** Maps spending vs limit to on-track / near-limit / over. */
export const getBudgetStatus = (spent, limit) => {
  if (spent > limit) return BUDGET_STATUS.OVER;
  if (limit > 0 && (spent / limit) * 100 >= BUDGET_WARNING_PERCENT) return BUDGET_STATUS.NEAR_LIMIT;
  return BUDGET_STATUS.ON_TRACK;
};
