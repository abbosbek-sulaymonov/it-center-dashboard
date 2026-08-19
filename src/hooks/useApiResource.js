import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Runs an API function and tracks its loading/error/data state.
 *
 * `fetcher` must be stable (wrap it in useCallback), because a new reference
 * triggers a refetch. Results arriving after unmount are dropped.
 */
export function useApiResource(fetcher, { immediate = true, initialData = null } = {}) {
  const [data, setData] = useState(initialData);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetcher();
      if (!mountedRef.current) return null;
      setData(response?.data ?? null);
      setMeta(response?.meta ?? null);
      return response;
    } catch (caught) {
      if (mountedRef.current) setError(caught);
      return null;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    if (immediate) run();
  }, [immediate, run]);

  return { data, meta, loading, error, refetch: run, setData };
}
