import { currentMonthKey, formatMonthLabel, shiftMonth } from '../../utils/date.js';
import Icon from '../common/Icon.jsx';

const arrowClass =
  'rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40';

/** Previous / next month stepper; future months are disabled. */
export default function MonthPicker({ month, onChange }) {
  const isCurrentMonth = month >= currentMonthKey();

  return (
    <div className="flex items-center rounded-lg border border-slate-300 bg-white">
      <button
        type="button"
        className={arrowClass}
        onClick={() => onChange(shiftMonth(month, -1))}
        aria-label="Previous month"
      >
        <Icon name="chevronLeft" className="size-4" />
      </button>
      <span
        className="min-w-32 px-2 text-center text-sm font-medium text-slate-800"
        aria-live="polite"
      >
        {formatMonthLabel(month)}
      </span>
      <button
        type="button"
        className={arrowClass}
        onClick={() => onChange(shiftMonth(month, 1))}
        disabled={isCurrentMonth}
        aria-label="Next month"
      >
        <Icon name="chevronRight" className="size-4" />
      </button>
    </div>
  );
}
