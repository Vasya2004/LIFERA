'use client';

import { Suspense } from 'react';
import MediaArchivePage from '@/components/pages/MediaArchivePage';
import LoadingState from '@/components/LoadingState';

const TABS = [
  { key: 'all', label: 'Все' },
  { key: 'movie', label: 'Фильмы' },
  { key: 'series', label: 'Сериалы' },
  { key: 'documentary', label: 'Документальные' },
];

function CinemaArchive() {
  return (
    <MediaArchivePage
      title="КИНО"
      tabs={TABS}
      defaultTab="all"
    />
  );
}

export default function MoviesPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CinemaArchive />
    </Suspense>
  );
}
