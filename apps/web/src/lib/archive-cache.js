const cache = new Map();
const inflight = new Map();

export function getCached(key) {
  return cache.get(key);
}

export function setCached(key, data) {
  cache.set(key, Array.isArray(data) ? data : []);
}

export function clearCached(key) {
  cache.delete(key);
  inflight.delete(key);
}

export function clearCachedByPrefix(prefix) {
  for (const key of [...cache.keys()]) {
    if (key === prefix || key.startsWith(`${prefix}:`) || key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
  for (const key of [...inflight.keys()]) {
    if (key === prefix || key.startsWith(`${prefix}:`) || key.startsWith(prefix)) {
      inflight.delete(key);
    }
  }
}

/** Load data, share in-flight requests, and store result in memory cache. */
export function loadArchive(key, loader, { force = false } = {}) {
  if (!force && inflight.has(key)) {
    return inflight.get(key);
  }

  const promise = Promise.resolve()
    .then(loader)
    .then((rows) => {
      const data = Array.isArray(rows) ? rows : [];
      setCached(key, data);
      return data;
    })
    .finally(() => {
      if (inflight.get(key) === promise) {
        inflight.delete(key);
      }
    });

  inflight.set(key, promise);
  return promise;
}
