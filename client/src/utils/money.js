const MINOR_UNITS_PER_MAJOR = 100;
const DEFAULT_CURRENCY = 'INR';
const LOCALE_BY_CURRENCY = { INR: 'en-IN' };
const DEFAULT_LOCALE = 'en-US';
const COMPACT_OPTIONS = { notation: 'compact', maximumFractionDigits: 1 };

const formatters = new Map();

/** Cached Intl currency formatter per currency + style. */
const getFormatter = (currency, compact) => {
  const key = `${currency}:${compact}`;
  if (!formatters.has(key)) {
    formatters.set(
      key,
      new Intl.NumberFormat(LOCALE_BY_CURRENCY[currency] ?? DEFAULT_LOCALE, {
        style: 'currency',
        currency,
        ...(compact && COMPACT_OPTIONS),
      }),
    );
  }
  return formatters.get(key);
};

const toMajor = (minorUnits) => (minorUnits ?? 0) / MINOR_UNITS_PER_MAJOR;

/** Formats integer minor units (e.g. 25050) as currency (e.g. ₹250.50). */
export const formatMoney = (minorUnits, currency = DEFAULT_CURRENCY) =>
  getFormatter(currency, false).format(toMajor(minorUnits));

/** Short label for chart axes, e.g. 1234567 minor units -> "₹12.3K". */
export const formatCompactMoney = (minorUnits, currency = DEFAULT_CURRENCY) =>
  getFormatter(currency, true).format(toMajor(minorUnits));

/**
 * Converts a validated major-unit string ("250.5") to integer minor units (25050)
 * using string arithmetic to avoid floating-point rounding errors.
 */
export const toMinorUnits = (value) => {
  const [whole, fraction = ''] = String(value).trim().split('.');
  return Number(whole) * MINOR_UNITS_PER_MAJOR + Number(fraction.padEnd(2, '0').slice(0, 2));
};

/** Converts integer minor units to a plain major-unit string for form inputs ("250.50"). */
export const toMajorUnits = (minorUnits) => toMajor(minorUnits).toFixed(2);
