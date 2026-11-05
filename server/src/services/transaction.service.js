import { MINOR_UNITS_PER_MAJOR } from '../constants/currency.js';
import { MESSAGES } from '../constants/messages.js';
import { EXPORT_MAX_ROWS, PAGINATION } from '../constants/pagination.js';
import { Transaction } from '../models/Transaction.js';
import { ApiError } from '../utils/ApiError.js';
import { toCsv } from '../utils/csv.js';
import { buildDateRange, toIsoDate } from '../utils/date.js';
import { escapeRegex } from '../utils/escapeRegex.js';
import { findAccessibleCategory } from './category.service.js';

const CATEGORY_POPULATE = { path: 'category', select: 'name type icon color' };
const DEFAULT_SORT = { date: -1, createdAt: -1 };
const CSV_HEADERS = ['Date', 'Type', 'Category', 'Amount', 'Note'];

/** Builds the user-scoped Mongo filter from validated list/export query params. */
const buildFilter = (userId, { from, to, category, type, q }) => {
  const filter = { user: userId };
  const date = buildDateRange(from, to);
  if (date) filter.date = date;
  if (category) filter.category = category;
  if (type) filter.type = type;
  if (q) filter.note = { $regex: escapeRegex(q), $options: 'i' };
  return filter;
};

/** Ensures the category is visible to the user and matches the transaction type. */
const assertValidCategory = async (userId, categoryId, type) => {
  const category = await findAccessibleCategory(userId, categoryId);
  if (!category) {
    throw ApiError.badRequest(MESSAGES.CATEGORY_NOT_FOUND, [
      { field: 'category', msg: MESSAGES.CATEGORY_NOT_FOUND },
    ]);
  }
  if (category.type !== type) {
    throw ApiError.badRequest(MESSAGES.CATEGORY_TYPE_MISMATCH, [
      { field: 'category', msg: MESSAGES.CATEGORY_TYPE_MISMATCH },
    ]);
  }
};

const findOwnedTransaction = async (userId, transactionId) => {
  const transaction = await Transaction.findOne({ _id: transactionId, user: userId });
  if (!transaction) throw ApiError.notFound(MESSAGES.TRANSACTION_NOT_FOUND);
  return transaction;
};

export const createTransaction = async (userId, data) => {
  await assertValidCategory(userId, data.category, data.type);
  const transaction = await Transaction.create({ ...data, user: userId });
  return transaction.populate(CATEGORY_POPULATE);
};

export const listTransactions = async (userId, query) => {
  const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } = query;
  const filter = buildFilter(userId, query);

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .sort(DEFAULT_SORT)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate(CATEGORY_POPULATE),
    Transaction.countDocuments(filter),
  ]);

  return {
    transactions,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getTransaction = async (userId, transactionId) => {
  const transaction = await findOwnedTransaction(userId, transactionId);
  return transaction.populate(CATEGORY_POPULATE);
};

export const updateTransaction = async (userId, transactionId, updates) => {
  const transaction = await findOwnedTransaction(userId, transactionId);

  if (updates.category || updates.type) {
    await assertValidCategory(
      userId,
      updates.category ?? transaction.category,
      updates.type ?? transaction.type,
    );
  }

  transaction.set(updates);
  await transaction.save();
  return transaction.populate(CATEGORY_POPULATE);
};

export const deleteTransaction = async (userId, transactionId) => {
  const transaction = await findOwnedTransaction(userId, transactionId);
  await transaction.deleteOne();
};

/** Exports filtered transactions as CSV; amounts are converted to major units. */
export const exportTransactionsCsv = async (userId, query) => {
  const transactions = await Transaction.find(buildFilter(userId, query))
    .sort(DEFAULT_SORT)
    .limit(EXPORT_MAX_ROWS)
    .populate(CATEGORY_POPULATE)
    .lean();

  const rows = transactions.map((t) => [
    toIsoDate(t.date),
    t.type,
    t.category?.name ?? '',
    (t.amount / MINOR_UNITS_PER_MAJOR).toFixed(2),
    t.note,
  ]);
  return toCsv(CSV_HEADERS, rows);
};
