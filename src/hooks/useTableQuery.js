import { useCallback, useMemo, useState } from 'react';

/** Paging + search state shared by every list screen. */
export function useTableQuery({ limit = 12, ...initialFilters } = {}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(initialFilters);

  // Searching or filtering should always drop the user back to page one.
  const applySearch = useCallback((value) => {
    setSearch(value);
    setPage(1);
  }, []);

  const applyFilter = useCallback((key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }, []);

  const params = useMemo(() => {
    const next = { page, limit };
    if (search) next.search = search;
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '') next[key] = value;
    }
    return next;
  }, [page, limit, search, filters]);

  return { page, setPage, search, applySearch, filters, applyFilter, params };
}
