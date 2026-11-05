import { TRANSACTION_TYPES } from '../constants/transactions.js';
import { todayInputDate, toInputDate } from './date.js';
import { toMajorUnits, toMinorUnits } from './money.js';

/** Defaults for a new transaction: expense, today, empty amount. */
export const emptyTransactionValues = () => ({
  type: TRANSACTION_TYPES.EXPENSE,
  amount: '',
  category: '',
  date: todayInputDate(),
  note: '',
});

/** API transaction -> form values (amount in major units, date as YYYY-MM-DD). */
export const toTransactionFormValues = (transaction) => ({
  type: transaction.type,
  amount: toMajorUnits(transaction.amount),
  category: transaction.category?._id ?? '',
  date: toInputDate(transaction.date),
  note: transaction.note ?? '',
});

/** Form values -> API payload (amount in integer minor units). */
export const toTransactionPayload = (values) => ({
  type: values.type,
  amount: toMinorUnits(values.amount),
  category: values.category,
  date: values.date,
  note: values.note,
});
