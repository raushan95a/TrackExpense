import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FILTER_KEYS } from '../constants/transactions.js';

const PAGE_KEY = 'page';

/**
 * Keeps transaction filters and page in the URL so they survive reloads,
 * can be shared, and work with the browser back button.
 */
export function useTransactionFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => Object.fromEntries(FILTER_KEYS.map((key) => [key, searchParams.get(key) ?? ''])),
    [searchParams],
  );
  const page = Math.max(1, Number(searchParams.get(PAGE_KEY)) || 1);

  const updateParams = useCallback(
    (mutate) =>
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          mutate(next);
          return next;
        },
        { replace: true },
      ),
    [setSearchParams],
  );

  /** Applies several filter changes at once ('' removes a filter) and returns to page 1. */
  const setFilters = useCallback(
    (updates) =>
      updateParams((params) => {
        Object.entries(updates).forEach(([key, value]) => {
          if (value) params.set(key, value);
          else params.delete(key);
        });
        params.delete(PAGE_KEY);
      }),
    [updateParams],
  );

  const setPage = useCallback(
    (nextPage) =>
      updateParams((params) => {
        if (nextPage > 1) params.set(PAGE_KEY, String(nextPage));
        else params.delete(PAGE_KEY);
      }),
    [updateParams],
  );

  const resetFilters = useCallback(() => setSearchParams({}, { replace: true }), [setSearchParams]);

  const hasActiveFilters = FILTER_KEYS.some((key) => filters[key]);

  return { filters, page, setFilters, setPage, resetFilters, hasActiveFilters };
}
