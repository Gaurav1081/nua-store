import { useState, useEffect, useCallback } from 'react';

const BASE_URL = 'https://fakestoreapi.com';
const cache = new Map();

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;
    if (cache.has(url)) {
      setData(cache.get(url));
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      cache.set(url, json);
      setData(json);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useProducts() {
  return useFetch(`${BASE_URL}/products`);
}

export function useProduct(id) {
  return useFetch(id ? `${BASE_URL}/products/${id}` : null);
}

export function useCategories() {
  return useFetch(`${BASE_URL}/products/categories`);
}
