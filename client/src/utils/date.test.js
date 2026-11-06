import { describe, expect, it } from 'vitest';
import {
  formatDate,
  formatMonthLabel,
  getMonthDateRange,
  shiftMonth,
  toInputDate,
} from './date.js';

describe('date utils', () => {
  it('reads the calendar day from UTC-midnight ISO dates (no timezone shift)', () => {
    expect(formatDate('2026-03-01T00:00:00.000Z')).toBe('01 Mar 2026');
    expect(toInputDate('2026-12-31T00:00:00.000Z')).toBe('2026-12-31');
  });

  it('shifts months across year boundaries', () => {
    expect(shiftMonth('2026-01', -1)).toBe('2025-12');
    expect(shiftMonth('2026-12', 1)).toBe('2027-01');
  });

  it('builds an inclusive date range for a month, including leap years', () => {
    expect(getMonthDateRange('2028-02')).toEqual({ from: '2028-02-01', to: '2028-02-29' });
    expect(getMonthDateRange('2026-04')).toEqual({ from: '2026-04-01', to: '2026-04-30' });
  });

  it('labels months for display', () => {
    expect(formatMonthLabel('2026-03')).toBe('March 2026');
  });
});
