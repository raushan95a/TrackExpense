const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Builds a Mongo date filter. A date-only `to` (YYYY-MM-DD) includes that whole day (UTC).
 * @returns {object|undefined} e.g. { $gte: Date, $lt: Date }
 */
export const buildDateRange = (from, to) => {
  const range = {};
  if (from) range.$gte = new Date(from);
  if (to) {
    if (DATE_ONLY_PATTERN.test(to)) range.$lt = new Date(new Date(to).getTime() + ONE_DAY_MS);
    else range.$lte = new Date(to);
  }
  return Object.keys(range).length ? range : undefined;
};

/** Formats a Date as YYYY-MM-DD (UTC). */
export const toIsoDate = (date) => new Date(date).toISOString().slice(0, 10);

/** Formats a Date as YYYY-MM (UTC). */
export const toMonthKey = (date) => new Date(date).toISOString().slice(0, 7);

export const currentMonth = () => toMonthKey(new Date());

export const currentYear = () => new Date().getUTCFullYear();

/** UTC range for a YYYY-MM month as a Mongo filter: { $gte: start, $lt: nextMonthStart }. */
export const getMonthRange = (month) => {
  const [year, monthNumber] = month.split('-').map(Number);
  return {
    $gte: new Date(Date.UTC(year, monthNumber - 1, 1)),
    $lt: new Date(Date.UTC(year, monthNumber, 1)),
  };
};

/** UTC range for a calendar year as a Mongo filter. */
export const getYearRange = (year) => ({
  $gte: new Date(Date.UTC(year, 0, 1)),
  $lt: new Date(Date.UTC(year + 1, 0, 1)),
});
