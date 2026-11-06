import { describe, expect, it } from 'vitest';
import { BUDGET_STATUS } from '../constants/budgets.js';
import { getBudgetStatus } from './budget.js';

describe('getBudgetStatus', () => {
  it.each([
    [0, 1000, BUDGET_STATUS.ON_TRACK],
    [799, 1000, BUDGET_STATUS.ON_TRACK],
    [800, 1000, BUDGET_STATUS.NEAR_LIMIT],
    [1000, 1000, BUDGET_STATUS.NEAR_LIMIT],
    [1001, 1000, BUDGET_STATUS.OVER],
  ])('spent %i of %i -> %s', (spent, limit, expected) => {
    expect(getBudgetStatus(spent, limit)).toBe(expected);
  });
});
