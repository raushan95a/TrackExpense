import { describe, expect, it } from 'vitest';
import { formatCompactMoney, formatMoney, toMajorUnits, toMinorUnits } from './money.js';

describe('toMinorUnits', () => {
  it.each([
    ['250', 25000],
    ['250.5', 25050],
    ['250.50', 25050],
    ['0.1', 10],
    ['19.99', 1999],
    ['1.10', 110],
    [' 42 ', 4200],
  ])('converts %j to %i without floating-point drift', (input, expected) => {
    expect(toMinorUnits(input)).toBe(expected);
  });
});

describe('toMajorUnits', () => {
  it('returns a two-decimal string for form inputs', () => {
    expect(toMajorUnits(25050)).toBe('250.50');
    expect(toMajorUnits(5)).toBe('0.05');
  });

  it('round-trips with toMinorUnits', () => {
    [1, 99, 100, 123456, 999999999].forEach((minor) => {
      expect(toMinorUnits(toMajorUnits(minor))).toBe(minor);
    });
  });
});

describe('formatMoney', () => {
  it('uses Indian digit grouping for INR', () => {
    expect(formatMoney(12345678, 'INR')).toBe('₹1,23,456.78');
  });

  it('formats other currencies', () => {
    expect(formatMoney(12345678, 'USD')).toBe('$123,456.78');
  });

  it('treats missing values as zero', () => {
    expect(formatMoney(undefined, 'INR')).toBe('₹0.00');
  });
});

describe('formatCompactMoney', () => {
  it('shortens large values for chart axes', () => {
    expect(formatCompactMoney(8000000, 'USD')).toBe('$80K');
  });
});
