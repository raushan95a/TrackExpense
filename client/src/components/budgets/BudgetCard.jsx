import { BUDGET_STATUS_META } from '../../constants/budgets.js';
import { getBudgetStatus } from '../../utils/budget.js';
import CategoryBadge from '../transactions/CategoryBadge.jsx';
import BudgetProgressBar from './BudgetProgressBar.jsx';

const actionClass = 'rounded-md px-2 py-1 text-sm font-medium';

export default function BudgetCard({ budget, currency, onEdit, onDelete }) {
  const status = BUDGET_STATUS_META[getBudgetStatus(budget.spent, budget.limit)];

  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <CategoryBadge category={budget.category} />
          <p className="mt-1 pl-10 text-xs font-medium text-slate-500">{status.label}</p>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            className={`${actionClass} text-brand-600 hover:bg-brand-50`}
            onClick={() => onEdit(budget)}
          >
            Edit
          </button>
          <button
            type="button"
            className={`${actionClass} text-red-600 hover:bg-red-50`}
            onClick={() => onDelete(budget)}
          >
            Delete
          </button>
        </div>
      </div>
      <BudgetProgressBar spent={budget.spent} limit={budget.limit} currency={currency} />
    </li>
  );
}
