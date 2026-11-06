const API_PREFIX = '/api/v1';
const VERSIONED_PATH = /\/api\/v\d+$/;

/**
 * Normalises the configured API base URL so small deployment typos still work:
 * trailing slashes are removed and `/api/v1` is appended when no version path is
 * present (e.g. `https://api.example.com/` → `https://api.example.com/api/v1`).
 */
export const normalizeApiUrl = (url, fallback) => {
  const trimmed = (url ?? '').trim().replace(/\/+$/, '');
  if (!trimmed) return fallback;
  return VERSIONED_PATH.test(trimmed) ? trimmed : `${trimmed}${API_PREFIX}`;
};
