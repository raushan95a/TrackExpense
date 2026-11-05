import { MESSAGES } from '../constants/messages.js';
import { TRANSACTION_TYPES } from '../constants/transaction.js';
import { Budget } from '../models/Budget.js';
import { ApiError } from '../utils/ApiError.js';
import { currentMonth, getMonthRange } from '../utils/date.js';
import { toPercent } from '../utils/percent.js';
import { sumByCategory } from './analytics.service.js';
import { findAccessibleCategory } from './category.service.js';

const CATEGORY_POPULATE = { path: 'category', select: 'name type icon color' };

/** Adds spent, remaining, percentUsed and isExceeded to each budget. */
const withSpending = async (userId, month, budgets) => {
  if (!budgets.length) return [];

  const categoryIds = budgets.map((b) => b.category._id);
  const sums = await sumByCategory(userId, getMonthRange(month), { categoryIds });
  const spentByCategory = new Map(sums.map((s) => [String(s._id), s.total]));

  return budgets.map((budget) => {
    const spent = spentByCategory.get(String(budget.category._id)) ?? 0;
    return {
      ...budget.toJSON(),
      spent,
      remaining: budget.limit - spent,
      percentUsed: toPercent(spent, budget.limit),
      isExceeded: spent > budget.limit,
    };
  });
};

const assertExpenseCategory = async (userId, categoryId) => {
  const category = await findAccessibleCategory(userId, categoryId);
  if (!category) {
    throw ApiError.badRequest(MESSAGES.CATEGORY_NOT_FOUND, [
      { field: 'category', msg: MESSAGES.CATEGORY_NOT_FOUND },
    ]);
  }
  if (category.type !== TRANSACTION_TYPES.EXPENSE) {
    throw ApiError.badRequest(MESSAGES.BUDGET_EXPENSE_ONLY, [
      { field: 'category', msg: MESSAGES.BUDGET_EXPENSE_ONLY },
    ]);
  }
};

export const listBudgets = async (userId, month = currentMonth()) => {
  const budgets = await Budget.find({ user: userId, month }).populate(CATEGORY_POPULATE);
  const enriched = await withSpending(userId, month, budgets);
  enriched.sort((a, b) => a.category.name.localeCompare(b.category.name));

  const limit = enriched.reduce((sum, b) => sum + b.limit, 0);
  const spent = enriched.reduce((sum, b) => sum + b.spent, 0);
  return { month, budgets: enriched, totals: { limit, spent, remaining: limit - spent } };
};

/**
 * Creates or updates the budget for (user, category, month).
 * @returns {Promise<{budget: object, created: boolean}>}
 */
export const upsertBudget = async (userId, { category, month, limit }) => {
  await assertExpenseCategory(userId, category);

  const result = await Budget.findOneAndUpdate(
    { user: userId, category, month },
    { $set: { limit } },
    {
      upsert: true,
      returnDocument: 'after',
      runValidators: true,
      setDefaultsOnInsert: true,
      includeResultMetadata: true,
    },
  );

  // populate() is not applied when includeResultMetadata is set, so re-read the document.
  const saved = await Budget.findById(result.value._id).populate(CATEGORY_POPULATE);
  const [budget] = await withSpending(userId, month, [saved]);
  return { budget, created: !result.lastErrorObject?.updatedExisting };
};

export const deleteBudget = async (userId, budgetId) => {
  const budget = await Budget.findOneAndDelete({ _id: budgetId, user: userId });
  if (!budget) throw ApiError.notFound(MESSAGES.BUDGET_NOT_FOUND);
};
