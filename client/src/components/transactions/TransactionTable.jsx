import { generatePath, Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.js';
import { TYPE_LABELS } from '../../constants/transactions.js';
import { formatDate } from '../../utils/date.js';
import AmountText from './AmountText.jsx';
import CategoryBadge from './CategoryBadge.jsx';

const editPath = (id) => generatePath(ROUTES.EDIT_TRANSACTION, { id });

const actionLinkClass = 'rounded-md px-2 py-1 text-sm font-medium text-brand-600 hover:bg-brand-50';
const deleteButtonClass = 'rounded-md px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50';

function RowActions({ transaction, onDelete }) {
  return (
    <div className="flex justify-end gap-1">
      <Link to={editPath(transaction._id)} className={actionLinkClass}>
        Edit
      </Link>
      <button type="button" className={deleteButtonClass} onClick={() => onDelete(transaction)}>
        Delete
      </button>
    </div>
  );
}

/** Table on md+ screens, stacked cards on mobile. */
export default function TransactionTable({ transactions, currency, onDelete }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table className="hidden w-full text-left text-sm md:table">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Note</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 text-right font-medium">Amount</th>
            <th className="px-4 py-3 text-right font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {transactions.map((t) => (
            <tr key={t._id} className="hover:bg-slate-50/60">
              <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDate(t.date)}</td>
              <td className="px-4 py-3">
                <CategoryBadge category={t.category} />
              </td>
              <td className="max-w-xs truncate px-4 py-3 text-slate-600" title={t.note}>
                {t.note || <span className="text-slate-400">—</span>}
              </td>
              <td className="px-4 py-3 text-slate-600">{TYPE_LABELS[t.type]}</td>
              <td className="whitespace-nowrap px-4 py-3 text-right">
                <AmountText amount={t.amount} type={t.type} currency={currency} />
              </td>
              <td className="px-4 py-3">
                <RowActions transaction={t} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="divide-y divide-slate-100 md:hidden">
        {transactions.map((t) => (
          <li key={t._id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <CategoryBadge category={t.category} />
              <AmountText amount={t.amount} type={t.type} currency={currency} />
            </div>
            {t.note && <p className="mt-2 text-sm text-slate-600">{t.note}</p>}
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-slate-500">{formatDate(t.date)}</span>
              <RowActions transaction={t} onDelete={onDelete} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
