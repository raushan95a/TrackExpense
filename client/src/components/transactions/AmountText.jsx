import { TRANSACTION_TYPES } from '../../constants/transactions.js';
import { formatMoney } from '../../utils/money.js';

/** Signed, coloured amount: green +income, red −expense. */
export default function AmountText({ amount, type, currency, className = '' }) {
  const isIncome = type === TRANSACTION_TYPES.INCOME;
  return (
    <span
      className={`font-semibold tabular-nums ${isIncome ? 'text-emerald-600' : 'text-red-600'} ${className}`}
    >
      {isIncome ? '+' : '−'}
      {formatMoney(amount, currency)}
    </span>
  );
}
