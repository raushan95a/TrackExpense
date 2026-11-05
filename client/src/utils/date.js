import { addMonths, endOfMonth, format, parseISO } from 'date-fns';

const DISPLAY_FORMAT = 'dd MMM yyyy';
const INPUT_FORMAT = 'yyyy-MM-dd';
const MONTH_KEY_FORMAT = 'yyyy-MM';

export const MONTH_KEY_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

/**
 * Transaction dates are stored as UTC midnight of the chosen day, so read the
 * calendar date from the ISO string instead of converting to local time.
 */
const toCalendarDate = (isoDate) => parseISO(String(isoDate).slice(0, 10));

const monthStart = (monthKey) => parseISO(`${monthKey}-01`);

/** "2026-03-15T00:00:00.000Z" -> "15 Mar 2026" */
export const formatDate = (isoDate) => format(toCalendarDate(isoDate), DISPLAY_FORMAT);

/** ISO date -> "2026-03-15" for <input type="date"> */
export const toInputDate = (isoDate) => format(toCalendarDate(isoDate), INPUT_FORMAT);

/** Today's local date as "YYYY-MM-DD". */
export const todayInputDate = () => format(new Date(), INPUT_FORMAT);

/** Current local month as "YYYY-MM". */
export const currentMonthKey = () => format(new Date(), MONTH_KEY_FORMAT);

/** "2026-03" + 1 -> "2026-04" */
export const shiftMonth = (monthKey, amount) =>
  format(addMonths(monthStart(monthKey), amount), MONTH_KEY_FORMAT);

/** "2026-03" -> "March 2026" */
export const formatMonthLabel = (monthKey) => format(monthStart(monthKey), 'MMMM yyyy');

/** "2026-03" -> "Mar" */
export const formatShortMonth = (monthKey) => format(monthStart(monthKey), 'MMM');

/** "2026-03" -> { from: "2026-03-01", to: "2026-03-31" } for transaction filters. */
export const getMonthDateRange = (monthKey) => ({
  from: format(monthStart(monthKey), INPUT_FORMAT),
  to: format(endOfMonth(monthStart(monthKey)), INPUT_FORMAT),
});
