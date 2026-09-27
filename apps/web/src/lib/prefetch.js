import { activityApi, mediaApi, thingApi, travelApi } from '@/lib/entries';
import { loadArchive } from '@/lib/archive-cache';

/** Warm memory cache for a route. Safe to call often. */
export function prefetchRoute(_queryClient, path) {
  if (!path || typeof window === 'undefined') return;

  if (path.startsWith('/movies')) {
    loadArchive('media:all', () => mediaApi.listCinema()).catch(() => {});
    loadArchive('media:movie', () => mediaApi.listByType('movie')).catch(() => {});
    loadArchive('media:series', () => mediaApi.listByType('series')).catch(() => {});
    loadArchive('media:documentary', () => mediaApi.listByType('documentary')).catch(() => {});
    return;
  }

  if (path.startsWith('/games')) {
    loadArchive('media:game', () => mediaApi.listByType('game')).catch(() => {});
    return;
  }

  if (path.startsWith('/travel')) {
    loadArchive('travel', () => travelApi.list()).catch(() => {});
    return;
  }

  if (path.startsWith('/activities')) {
    loadArchive('activities', () => activityApi.list()).catch(() => {});
    return;
  }

  if (path.startsWith('/things')) {
    loadArchive('things', () => thingApi.list()).catch(() => {});
  }
}

export function prefetchAllArchives() {
  [
    '/movies',
    '/games',
    '/activities',
    '/things',
    '/travel',
  ].forEach((path) => prefetchRoute(null, path));
}
