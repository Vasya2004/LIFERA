'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import CardActions from '@/components/CardActions';
import { useCardInteraction } from '@/hooks/useCardInteraction';

const CATEGORY_LABELS = {
  gadget: 'Гаджет',
  tech: 'Техника',
  wear: 'Носимое',
  home: 'Дом',
  collectible: 'Коллекция',
  other: 'Другое',
};

export default function ThingCard({ entry, onEdit, onDelete }) {
  const { touchUi, active, bindCard, toggle, close } = useCardInteraction();

  return (
    <motion.div
      className="group relative aspect-[2/3] cursor-pointer overflow-hidden rounded-card border border-border bg-card"
      {...bindCard}
    >
      {entry.cover_url ? (
        <img
          src={entry.cover_url}
          alt={entry.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary">
          <span className="font-bebas text-5xl text-muted-foreground/30">
            {entry.title?.[0] || '?'}
          </span>
        </div>
      )}

      <div className="poster-gradient" />

      {entry.rating != null && (
        <div className="glass-badge absolute right-2 top-2 z-10">
          <span className="font-bebas text-xl leading-none text-primary">
            {entry.rating.toFixed(1)}
          </span>
        </div>
      )}

      <div className="absolute left-2 top-2 z-10">
        <span className="glass-badge font-inter text-[10px] font-medium uppercase tracking-widest text-white/75">
          {CATEGORY_LABELS[entry.category] || 'Вещь'}
        </span>
      </div>

      <div className={`absolute bottom-0 left-0 right-0 p-3 ${touchUi ? 'pr-14' : ''}`}>
        <h3 className="truncate font-bebas text-xl leading-tight text-white">{entry.title}</h3>
        {entry.brand && (
          <p className="mt-0.5 font-inter text-[11px] text-white/50">{entry.brand}</p>
        )}
        {entry.item_date && (
          <p className="mt-0.5 font-inter text-[11px] text-white/40">
            {format(new Date(entry.item_date), 'd MMM yyyy', { locale: ru })}
          </p>
        )}
        {entry.note && (
          <p className="mt-1 line-clamp-2 font-inter text-[11px] text-white/60">{entry.note}</p>
        )}
      </div>

      <CardActions
        active={active}
        touchUi={touchUi}
        onToggle={toggle}
        onEdit={() => {
          close();
          onEdit(entry);
        }}
        onDelete={() => {
          close();
          onDelete(entry.id);
        }}
      />
    </motion.div>
  );
}
