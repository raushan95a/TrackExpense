import { format, parseISO } from 'date-fns';

const DISPLAY_FORMAT = 'dd MMM yyyy';
const INPUT_FORMAT = 'yyyy-MM-dd';

/**
 * Transaction dates are stored as UTC midnight of the chosen day, so read the
 * calendar date from the ISO string instead of converting to local time.
 */
const toCalendarDate = (isoDate) => parseISO(String(isoDate).slice(0, 10));

/** "2026-03-15T00:00:00.000Z" -> "15 Mar 2026" */
export const formatDate = (isoDate) => format(toCalendarDate(isoDate), DISPLAY_FORMAT);

/** ISO date -> "2026-03-15" for <input type="date"> */
export const toInputDate = (isoDate) => format(toCalendarDate(isoDate), INPUT_FORMAT);

/** Today's local date as "YYYY-MM-DD". */
export const todayInputDate = () => format(new Date(), INPUT_FORMAT);
