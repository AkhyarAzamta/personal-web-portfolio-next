/**
 * Simple in-memory cache for API data.
 * Data persists for the lifetime of the browser session (tidak hilang saat pindah halaman).
 * Reset otomatis saat user refresh halaman (F5).
 *
 * Compatible dengan static export (next.config.ts output: 'export').
 */

type CacheEntry<T> = {
  data: T;
  fetchedAt: number;
};

// TTL: 5 menit — data akan di-refetch setelah 5 menit tanpa refresh
const TTL_MS = 5 * 60 * 1000;

// Module-level Map — persists across page navigations
const cache = new Map<string, CacheEntry<unknown>>();

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() - entry.fetchedAt > TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

export function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, fetchedAt: Date.now() });
}

export function hasCache(key: string): boolean {
  return getCached(key) !== null;
}
