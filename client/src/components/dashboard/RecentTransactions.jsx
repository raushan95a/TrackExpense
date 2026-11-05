import { formatDate } from '../../utils/date.js';
import AmountText from '../transactions/AmountText.jsx';
import CategoryBadge from '../transactions/CategoryBadge.jsx';

/** Compact list of the latest transactions. */
export default function RecentTransactions({ transactions, currency }) {
  return (
    <ul className="divide-y divide-slate-100">
      {transactions.map((t) => (
        <li
          key={t._id}
          className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
        >
          <div className="min-w-0">
            <CategoryBadge category={t.category} />
            <p className="mt-1 truncate pl-10 text-xs text-slate-500">
              {formatDate(t.date)}
              {t.note && ` · ${t.note}`}
            </p>
          </div>
          <AmountText amount={t.amount} type={t.type} currency={currency} className="shrink-0" />
        </li>
      ))}
    </ul>
  );
}
