import { BUDGET_STATUS, BUDGET_STATUS_META } from '../../constants/budgets.js';
import { getBudgetStatus } from '../../utils/budget.js';
import { formatMoney } from '../../utils/money.js';
import Icon from '../common/Icon.jsx';

/**
 * Spent vs limit. The status color is always paired with an icon and a label,
 * and the remaining/over amount is spelled out, so color is never the only cue.
 */
export default function BudgetProgressBar({ spent, limit, currency }) {
  const status = getBudgetStatus(spent, limit);
  const meta = BUDGET_STATUS_META[status];
  const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
  const difference = Math.abs(limit - spent);

  return (
    <div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.min(percent, 100)}
        aria-valuetext={`${percent}% of budget used`}
        className="h-2 overflow-hidden rounded-full bg-slate-100"
      >
        <div
          className="h-full rounded-full transition-[width]"
          style={{ width: `${Math.min(percent, 100)}%`, backgroundColor: meta.color }}
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="tabular-nums text-slate-600">
          <span className="font-medium text-slate-900">{formatMoney(spent, currency)}</span> of{' '}
          {formatMoney(limit, currency)} · {percent}%
        </span>
        <span className="flex items-center gap-1 font-medium text-slate-700">
          <Icon name={meta.icon} className="size-4 shrink-0" style={{ color: meta.color }} />
          {status === BUDGET_STATUS.OVER
            ? `Over by ${formatMoney(difference, currency)}`
            : `${formatMoney(difference, currency)} left`}
        </span>
      </div>
      <p className="sr-only">{meta.label}</p>
    </div>
  );
}
