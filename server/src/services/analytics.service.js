import { MONTHS_IN_YEAR } from '../constants/date.js';
import { TRANSACTION_TYPES } from '../constants/transaction.js';
import { Transaction } from '../models/Transaction.js';
import { currentMonth, currentYear, getMonthRange, getYearRange } from '../utils/date.js';
import { toObjectId } from '../utils/objectId.js';
import { toPercent } from '../utils/percent.js';

const { EXPENSE, INCOME } = TRANSACTION_TYPES;
/** $match + $group stages producing { _id: categoryId, total, count } per category. */
const categoryTotalsStages = (userId, dateRange, { type = EXPENSE, categoryIds } = {}) => [
  {
    $match: {
      user: toObjectId(userId),
      type,
      date: dateRange,
      ...(categoryIds && { category: { $in: categoryIds.map(toObjectId) } }),
    },
  },
  { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
];

/**
 * Sums amounts per category for a user within a date range (used for budget spending).
 * @returns {Promise<{_id: ObjectId, total: number, count: number}[]>}
 */
export const sumByCategory = (userId, dateRange, options) =>
  Transaction.aggregate(categoryTotalsStages(userId, dateRange, options));

/** Income, expense and balance for one month. */
export const getSummary = async (userId, month = currentMonth()) => {
  const totals = await Transaction.aggregate([
    { $match: { user: toObjectId(userId), date: getMonthRange(month) } },
    { $group: { _id: '$type', total: { $sum: '$amount' }, count: { $sum: 1 } } },
  ]);

  const byType = Object.fromEntries(totals.map((t) => [t._id, t]));
  const income = byType[INCOME]?.total ?? 0;
  const expense = byType[EXPENSE]?.total ?? 0;

  return {
    month,
    income,
    expense,
    balance: income - expense,
    transactionCount: totals.reduce((sum, t) => sum + t.count, 0),
  };
};

/** Per-category totals for one month, largest first, with percentage share. */
export const getByCategory = async (userId, { month = currentMonth(), type = EXPENSE } = {}) => {
  const rows = await Transaction.aggregate([
    ...categoryTotalsStages(userId, getMonthRange(month), { type }),
    { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
    { $unwind: '$category' },
    {
      $project: {
        _id: 0,
        categoryId: '$_id',
        name: '$category.name',
        icon: '$category.icon',
        color: '$category.color',
        total: 1,
        count: 1,
      },
    },
    { $sort: { total: -1, name: 1 } },
  ]);

  const total = rows.reduce((sum, row) => sum + row.total, 0);
  return {
    month,
    type,
    total,
    categories: rows.map((row) => ({ ...row, percentage: toPercent(row.total, total) })),
  };
};

/** Month-by-month income/expense for a year; months without data are zero-filled. */
export const getMonthly = async (userId, year = currentYear()) => {
  const rows = await Transaction.aggregate([
    { $match: { user: toObjectId(userId), date: getYearRange(year) } },
    {
      $group: {
        _id: { month: { $month: '$date' }, type: '$type' },
        total: { $sum: '$amount' },
      },
    },
  ]);

  const months = Array.from({ length: MONTHS_IN_YEAR }, (_, i) => ({
    month: `${year}-${String(i + 1).padStart(2, '0')}`,
    income: 0,
    expense: 0,
    balance: 0,
  }));

  rows.forEach(({ _id, total }) => {
    months[_id.month - 1][_id.type] = total;
  });
  months.forEach((m) => {
    m.balance = m.income - m.expense;
  });

  const income = months.reduce((sum, m) => sum + m.income, 0);
  const expense = months.reduce((sum, m) => sum + m.expense, 0);
  return { year, months, totals: { income, expense, balance: income - expense } };
};
