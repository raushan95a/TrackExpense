import { useCallback, useEffect, useEffectEvent, useState } from 'react';

/**
 * Runs `fetcher` whenever `key` changes (or `reload` is called) and tracks
 * data/error/loading. Previous data stays visible while the next request loads.
 * @param {() => Promise<any>} fetcher
 * @param {string} key  serialisable identity of the request (e.g. JSON of params)
 */
export function useFetch(fetcher, key) {
  const [reloadCount, setReloadCount] = useState(0);
  const [result, setResult] = useState({ data: null, error: null, requestId: null });
  const requestId = `${key}#${reloadCount}`;

  const runFetch = useEffectEvent(fetcher);

  useEffect(() => {
    let cancelled = false;
    runFetch()
      .then((data) => !cancelled && setResult({ data, error: null, requestId }))
      .catch((error) => !cancelled && setResult((prev) => ({ ...prev, error, requestId })));
    return () => {
      cancelled = true;
    };
  }, [requestId]);

  const reload = useCallback(() => setReloadCount((count) => count + 1), []);

  return {
    data: result.data,
    error: result.error,
    isLoading: result.requestId !== requestId,
    reload,
  };
}
