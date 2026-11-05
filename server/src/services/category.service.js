import { CASE_INSENSITIVE_COLLATION, DEFAULT_CATEGORIES } from '../constants/category.js';
import { MESSAGES } from '../constants/messages.js';
import { Budget } from '../models/Budget.js';
import { Category } from '../models/Category.js';
import { Transaction } from '../models/Transaction.js';
import { ApiError } from '../utils/ApiError.js';

/** Filter matching categories visible to a user: system defaults plus their own. */
const visibleTo = (userId) => ({ user: { $in: [null, userId] } });

/** Idempotently inserts system default categories (safe to run on every start). */
export const seedDefaultCategories = async () => {
  const operations = DEFAULT_CATEGORIES.map((category) => ({
    updateOne: {
      filter: { user: null, name: category.name, type: category.type },
      update: { $setOnInsert: { ...category, user: null } },
      upsert: true,
      collation: CASE_INSENSITIVE_COLLATION,
    },
  }));
  await Category.bulkWrite(operations);
};

export const listCategories = (userId, { type } = {}) =>
  Category.find({ ...visibleTo(userId), ...(type && { type }) }).sort({ type: 1, name: 1 });

/** Returns a default or user-owned category, or null if not accessible. */
export const findAccessibleCategory = (userId, categoryId) =>
  Category.findOne({ _id: categoryId, ...visibleTo(userId) });

const assertNameAvailable = async (userId, { name, type }, excludeId) => {
  const duplicate = await Category.exists({
    ...visibleTo(userId),
    name,
    type,
    ...(excludeId && { _id: { $ne: excludeId } }),
  }).collation(CASE_INSENSITIVE_COLLATION);

  if (duplicate) {
    throw ApiError.conflict(MESSAGES.CATEGORY_EXISTS, [
      { field: 'name', msg: MESSAGES.CATEGORY_EXISTS },
    ]);
  }
};

const hasTransactions = (userId, categoryId) =>
  Transaction.exists({ user: userId, category: categoryId });

const hasBudgets = (userId, categoryId) => Budget.exists({ user: userId, category: categoryId });

/** Loads a category the user may modify; defaults are read-only. */
const getEditableCategory = async (userId, categoryId) => {
  const category = await findAccessibleCategory(userId, categoryId);
  if (!category) throw ApiError.notFound(MESSAGES.CATEGORY_NOT_FOUND);
  if (category.isDefault) throw ApiError.forbidden(MESSAGES.CATEGORY_DEFAULT_READONLY);
  return category;
};

export const createCategory = async (userId, data) => {
  await assertNameAvailable(userId, data);
  return Category.create({ ...data, user: userId });
};

export const updateCategory = async (userId, categoryId, updates) => {
  const category = await getEditableCategory(userId, categoryId);
  const next = { name: category.name, type: category.type, ...updates };

  if (next.name !== category.name || next.type !== category.type) {
    await assertNameAvailable(userId, next, category._id);
  }
  // Changing type would leave transactions/budgets attached to a mismatched category.
  if (next.type !== category.type) {
    const [usedByTransactions, usedByBudgets] = await Promise.all([
      hasTransactions(userId, category._id),
      hasBudgets(userId, category._id),
    ]);
    if (usedByTransactions || usedByBudgets) throw ApiError.conflict(MESSAGES.CATEGORY_TYPE_LOCKED);
  }

  category.set(updates);
  return category.save();
};

export const deleteCategory = async (userId, categoryId) => {
  const category = await getEditableCategory(userId, categoryId);
  if (await hasTransactions(userId, category._id)) {
    throw ApiError.conflict(MESSAGES.CATEGORY_IN_USE);
  }
  // Budgets have no meaning without their category, so remove them with it.
  await Budget.deleteMany({ user: userId, category: category._id });
  await category.deleteOne();
};
