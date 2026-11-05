const PRECISION = 10; // one decimal place

/** Percentage of part/whole rounded to one decimal; 0 when whole is 0. */
export const toPercent = (part, whole) =>
  whole ? Math.round((part / whole) * 100 * PRECISION) / PRECISION : 0;
