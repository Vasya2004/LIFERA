'use client';

import { AnimatePresence } from 'framer-motion';
import MediaCard from '@/components/MediaCard';

export default function MediaGrid({ entries, onEdit, onDelete }) {
  return (
    <div className="poster-grid">
      <AnimatePresence>
        {entries.map((entry) => (
          <MediaCard
            key={entry.id}
            entry={entry}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
