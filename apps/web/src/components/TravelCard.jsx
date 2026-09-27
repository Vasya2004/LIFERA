'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import TravelCollage from '@/components/TravelCollage';
import CardActions from '@/components/CardActions';
import { useCardInteraction } from '@/hooks/useCardInteraction';

export default function TravelCard({ entry, onEdit, onDelete }) {
  const { touchUi, active, bindCard, toggle, close } = useCardInteraction();

  return (
    <motion.div
      className="group relative aspect-[2/3] cursor-pointer overflow-hidden rounded-card border border-border bg-card"
      {...bindCard}
    >
      <TravelCollage photos={entry.photos || []} title={entry.title} />

      <div className="poster-gradient" />

      {entry.rating != null && (
        <div className="glass-badge absolute right-2 top-2 z-10">
          <span className="font-bebas text-xl leading-none text-primary">
            {entry.rating.toFixed(1)}
          </span>
        </div>
      )}

      {(entry.city || entry.country) && (
        <div className="absolute left-2 top-2 z-10">
          <span className="glass-badge font-inter text-[10px] font-medium uppercase tracking-widest text-white/75">
            {[entry.city, entry.country].filter(Boolean).join(', ')}
          </span>
        </div>
      )}

      <div className={`absolute bottom-0 left-0 right-0 p-3 ${touchUi ? 'pr-14' : ''}`}>
        <h3 className="truncate font-bebas text-xl leading-tight text-white">{entry.title}</h3>
        {entry.travel_date && (
          <p className="mt-0.5 font-inter text-[11px] text-white/50">
            {format(new Date(entry.travel_date), 'd MMM yyyy', { locale: ru })}
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
