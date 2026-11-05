import { SERIES_COLORS } from '../../constants/charts.js';
import { TRANSACTION_TYPES } from '../../constants/transactions.js';
import { formatMoney } from '../../utils/money.js';
import ErrorState from '../common/ErrorState.jsx';
import Icon from '../common/Icon.jsx';

const BALANCE_COLOR = '#4f46e5';

const CARDS = [
  {
    field: 'income',
    label: 'Income',
    icon: 'arrowDown',
    color: SERIES_COLORS[TRANSACTION_TYPES.INCOME],
  },
  {
    field: 'expense',
    label: 'Expense',
    icon: 'arrowUp',
    color: SERIES_COLORS[TRANSACTION_TYPES.EXPENSE],
  },
  { field: 'balance', label: 'Balance', icon: 'scale', color: BALANCE_COLOR },
];

function StatTile({ label, icon, color, value, caption, isLoading }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <span
          className="flex size-9 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}1a`, color }}
          aria-hidden="true"
        >
          <Icon name={icon} className="size-5" />
        </span>
        <span className="text-sm font-medium text-slate-500">{label}</span>
      </div>
      {isLoading ? (
        <div className="mt-4 h-8 w-32 animate-pulse rounded bg-slate-100" />
      ) : (
        <p className="mt-3 text-2xl font-semibold tabular-nums text-slate-900">{value}</p>
      )}
      <p className="mt-1 h-4 text-xs text-slate-500">{caption}</p>
    </div>
  );
}

/** Income, expense and balance for the selected month. */
export default function SummaryCards({ state, currency }) {
  const { data, error, reload } = state;
  if (error) return <ErrorState error={error} onRetry={reload} title="Could not load summary" />;

  const captions = {
    balance: data ? `${data.transactionCount} transactions` : '',
  };

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {CARDS.map(({ field, ...card }) => (
        <StatTile
          key={field}
          {...card}
          isLoading={!data}
          value={data && formatMoney(data[field], currency)}
          caption={captions[field]}
        />
      ))}
    </div>
  );
}
