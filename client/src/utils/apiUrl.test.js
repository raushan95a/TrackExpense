import { describe, expect, it } from 'vitest';
import { normalizeApiUrl } from './apiUrl.js';

const FALLBACK = 'http://localhost:5000/api/v1';

describe('normalizeApiUrl', () => {
  it('keeps a correct URL unchanged', () => {
    expect(normalizeApiUrl('https://api.example.com/api/v1', FALLBACK)).toBe(
      'https://api.example.com/api/v1',
    );
  });

  it('appends /api/v1 when the version path is missing', () => {
    expect(normalizeApiUrl('https://api.example.com', FALLBACK)).toBe(
      'https://api.example.com/api/v1',
    );
    expect(normalizeApiUrl('https://api.example.com/', FALLBACK)).toBe(
      'https://api.example.com/api/v1',
    );
  });

  it('strips trailing slashes and whitespace', () => {
    expect(normalizeApiUrl('  https://api.example.com/api/v1/  ', FALLBACK)).toBe(
      'https://api.example.com/api/v1',
    );
  });

  it('keeps other API versions', () => {
    expect(normalizeApiUrl('https://api.example.com/api/v2', FALLBACK)).toBe(
      'https://api.example.com/api/v2',
    );
  });

  it('uses the fallback when unset or blank', () => {
    expect(normalizeApiUrl(undefined, FALLBACK)).toBe(FALLBACK);
    expect(normalizeApiUrl('   ', FALLBACK)).toBe(FALLBACK);
  });
});
