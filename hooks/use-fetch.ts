"use client";
import { useState, useEffect, useCallback } from "react";

export function useFetch<T>(url: string, fallback: T) {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json();
      })
      .then(json => {
        setData(json.data || json);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, [url]);

  useEffect(() => { refetch(); }, [refetch]);

  return { data, loading, error, refetch };
}

// Auto-refresh version
export function useLiveFetch<T>(url: string, fallback: T, intervalMs = 60000) {
  const { data, loading, error, refetch } = useFetch<T>(url, fallback);

  useEffect(() => {
    const i = setInterval(refetch, intervalMs);
    return () => clearInterval(i);
  }, [refetch, intervalMs]);

  return { data, loading, error, refetch };
}
