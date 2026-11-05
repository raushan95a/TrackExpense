export const TRANSACTION_TYPES = Object.freeze({
  EXPENSE: 'expense',
  INCOME: 'income',
});

export const TRANSACTION_TYPE_VALUES = Object.freeze(Object.values(TRANSACTION_TYPES));

export const NOTE_MAX_LENGTH = 200;

/** Largest accepted amount in minor units (keeps sums well within safe integers). */
export const MAX_AMOUNT = 1_000_000_000_00;
