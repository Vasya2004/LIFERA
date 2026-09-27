'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { activityApi, mediaApi, thingApi, travelApi } from '@/lib/entries';
import {
  clearCachedByPrefix,
  getCached,
  loadArchive,
  setCached,
} from '@/lib/archive-cache';

export function useArchiveList(cacheKey, loader) {
  const [data, setDataState] = useState(() => getCached(cacheKey) ?? null);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);
  const requestId = useRef(0);

  const setData = useCallback(
    (updater) => {
      setDataState((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        if (Array.isArray(next)) setCached(cacheKey, next);
        return next;
      });
    },
    [cacheKey],
  );

  const refetch = useCallback(() => {
    clearCachedByPrefix(cacheKey);
    setVersion((value) => value + 1);
  }, [cacheKey]);

  // Instant switch: show cached list for the new key immediately.
  useEffect(() => {
    const cached = getCached(cacheKey);
    setDataState(cached ?? null);
    setError(null);
  }, [cacheKey]);

  useEffect(() => {
    const id = ++requestId.current;
    let cancelled = false;
    const hasCache = getCached(cacheKey) != null;

    // Only show spinner when there is nothing cached yet.
    if (!hasCache) {
      setDataState(null);
      setError(null);
    }

    const timeout = window.setTimeout(() => {
      if (cancelled || id !== requestId.current) return;
      if (getCached(cacheKey) == null) {
        setError(new Error('Превышено время ожидания ответа от сервера'));
        setDataState([]);
      }
    }, 8000);

    loadArchive(cacheKey, loader, { force: version > 0 || hasCache })
      .then((rows) => {
        if (cancelled || id !== requestId.current) return;
        window.clearTimeout(timeout);
        setDataState(rows);
        setError(null);
      })
      .catch((err) => {
        if (cancelled || id !== requestId.current) return;
        window.clearTimeout(timeout);
        console.error('Archive load failed:', err);
        // Keep cached data on background refresh failure.
        if (getCached(cacheKey) == null) {
          setError(err instanceof Error ? err : new Error('Не удалось загрузить данные'));
          setDataState([]);
        }
      });

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, version]);

  return {
    data,
    isLoading: data === null,
    isError: Boolean(error) && data === null,
    error,
    refetch,
    setData,
  };
}

export function createMutations(api, cachePrefix) {
  return {
    save: {
      mutate({ id, data }, options = {}) {
        const request = id ? api.update(id, data) : api.create(data);
        request
          .then((result) => {
            clearCachedByPrefix(cachePrefix);
            options.onSuccess?.(result);
          })
          .catch((err) => {
            console.error('Save failed:', err);
            options.onError?.(err);
          });
      },
    },
    remove: {
      mutate(id, options = {}) {
        api
          .remove(id)
          .then(() => {
            clearCachedByPrefix(cachePrefix);
            options.onSuccess?.();
          })
          .catch((err) => {
            console.error('Delete failed:', err);
            options.onError?.(err);
          });
      },
    },
  };
}

export function useMediaEntries(type) {
  const key = `media:${type}`;
  return useArchiveList(key, () =>
    type === 'all' ? mediaApi.listCinema() : mediaApi.listByType(type),
  );
}

export function useMediaMutations() {
  return createMutations(mediaApi, 'media');
}

export function useTravelEntries() {
  return useArchiveList('travel', () => travelApi.list());
}

export function useTravelMutations() {
  return createMutations(travelApi, 'travel');
}

export function useActivityEntries() {
  return useArchiveList('activities', () => activityApi.list());
}

export function useActivityMutations() {
  return createMutations(activityApi, 'activities');
}

export function useThingEntries() {
  return useArchiveList('things', () => thingApi.list());
}

export function useThingMutations() {
  return createMutations(thingApi, 'things');
}
