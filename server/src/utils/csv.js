const FORMULA_PREFIX = /^[=+\-@\t\r]/;
const NEEDS_QUOTES = /[",\r\n]/;

/** Escapes one CSV cell, neutralising spreadsheet formula injection in text cells. */
const escapeCell = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') return String(value);

  let text = String(value);
  if (FORMULA_PREFIX.test(text)) text = `'${text}`;
  return NEEDS_QUOTES.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/**
 * Serialises rows to CSV (RFC 4180, CRLF line endings).
 * @param {string[]} headers
 * @param {Array<Array<string|number>>} rows
 */
export const toCsv = (headers, rows) =>
  [headers, ...rows].map((row) => row.map(escapeCell).join(',')).join('\r\n');
