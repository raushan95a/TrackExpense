import { TRANSACTION_TYPES, TYPE_OPTIONS } from '../../constants/transactions.js';

const ACTIVE_CLASS = {
  [TRANSACTION_TYPES.EXPENSE]: 'bg-white text-red-600 shadow-sm',
  [TRANSACTION_TYPES.INCOME]: 'bg-white text-emerald-600 shadow-sm',
};

/** Segmented control for choosing expense vs income. */
export default function TypeToggle({ value, onChange }) {
  return (
    <div
      role="radiogroup"
      aria-label="Type"
      className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1"
    >
      {TYPE_OPTIONS.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={`rounded-lg py-2 text-sm font-medium transition ${
              isActive ? ACTIVE_CLASS[option.value] : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
