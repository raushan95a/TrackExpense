export const TRANSACTION_TYPES = Object.freeze({
  EXPENSE: 'expense',
  INCOME: 'income',
});

export const TYPE_LABELS = Object.freeze({
  [TRANSACTION_TYPES.EXPENSE]: 'Expense',
  [TRANSACTION_TYPES.INCOME]: 'Income',
});

export const TYPE_OPTIONS = Object.freeze(
  Object.values(TRANSACTION_TYPES).map((value) => ({ value, label: TYPE_LABELS[value] })),
);

export const PAGE_SIZE = 10;

export const NOTE_MAX_LENGTH = 200;

/** Largest amount accepted, in major units (mirrors server MAX_AMOUNT in minor units). */
export const MAX_AMOUNT_MAJOR = 1_000_000_000;

export const SEARCH_DEBOUNCE_MS = 400;

/** Query-string keys used for transaction filters. */
export const FILTER_KEYS = Object.freeze(['type', 'category', 'from', 'to', 'q']);
