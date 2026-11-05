const MINOR_UNITS_PER_MAJOR = 100;
const DEFAULT_CURRENCY = 'INR';
const LOCALE_BY_CURRENCY = { INR: 'en-IN' };
const DEFAULT_LOCALE = 'en-US';

const formatters = new Map();

const getFormatter = (currency) => {
  if (!formatters.has(currency)) {
    formatters.set(
      currency,
      new Intl.NumberFormat(LOCALE_BY_CURRENCY[currency] ?? DEFAULT_LOCALE, {
        style: 'currency',
        currency,
      }),
    );
  }
  return formatters.get(currency);
};

/** Formats integer minor units (e.g. 25050) as currency (e.g. ₹250.50). */
export const formatMoney = (minorUnits, currency = DEFAULT_CURRENCY) =>
  getFormatter(currency).format((minorUnits ?? 0) / MINOR_UNITS_PER_MAJOR);

/**
 * Converts a validated major-unit string ("250.5") to integer minor units (25050)
 * using string arithmetic to avoid floating-point rounding errors.
 */
export const toMinorUnits = (value) => {
  const [whole, fraction = ''] = String(value).trim().split('.');
  return Number(whole) * MINOR_UNITS_PER_MAJOR + Number(fraction.padEnd(2, '0').slice(0, 2));
};

/** Converts integer minor units to a plain major-unit string for form inputs ("250.50"). */
export const toMajorUnits = (minorUnits) => (minorUnits / MINOR_UNITS_PER_MAJOR).toFixed(2);
