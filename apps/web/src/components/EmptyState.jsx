'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const TYPE_EMOJI = {
  cinema: '🎬',
  movie: '🎬',
  documentary: '🎥',
  series: '📺',
  game: '🎮',
  thing: '📦',
  travel: '✈️',
  activity: '🏄',
};

export default function EmptyState({ type, onAdd }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <span className="mb-6 block text-6xl">{TYPE_EMOJI[type] || TYPE_EMOJI.movie}</span>
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-inter text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Plus size={16} />
        Добавить
      </button>
    </motion.div>
  );
}
