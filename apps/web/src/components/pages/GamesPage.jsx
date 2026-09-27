'use client';

import { Suspense } from 'react';
import MediaArchivePage from '@/components/pages/MediaArchivePage';
import LoadingState from '@/components/LoadingState';

function GamesArchive() {
  return <MediaArchivePage title="ИГРЫ" mediaType="game" />;
}

export default function GamesPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <GamesArchive />
    </Suspense>
  );
}
