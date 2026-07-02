import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../utils/api';

export const useSearch = (initialQuery = '') => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const products = await getProducts({ search: searchQuery });
      setResults(products);
    } catch (err) {
      setError(err.message || 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-search when query changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query && query.trim().length > 1) {
        performSearch(query);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    performSearch,
    clearSearch
  };
};
