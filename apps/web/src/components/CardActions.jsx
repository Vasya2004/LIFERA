'use client';

import { motion } from 'framer-motion';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

export default function CardActions({
  active,
  touchUi,
  onToggle,
  onEdit,
  onDelete,
}) {
  return (
    <>
      {touchUi && (
        <button
          type="button"
          aria-label="Действия"
          aria-expanded={active}
          onClick={(event) => {
            event.stopPropagation();
            onToggle();
          }}
          className="absolute bottom-2 right-2 z-20 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/65 text-white shadow-lg backdrop-blur-md transition-colors active:bg-black/80"
        >
          <MoreHorizontal size={18} strokeWidth={2.4} />
        </button>
      )}

      <motion.div
        initial={false}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        className={`absolute inset-0 z-30 flex items-center justify-center gap-4 bg-black/55 backdrop-blur-sm ${
          active ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        onClick={(event) => {
          event.stopPropagation();
          if (touchUi) onToggle();
        }}
      >
        <button
          type="button"
          aria-label="Редактировать"
          onClick={(event) => {
            event.stopPropagation();
            onEdit();
          }}
          className="grid h-12 w-12 place-items-center rounded-full bg-secondary/90 text-foreground shadow-lg backdrop-blur-md transition-colors hover:bg-primary hover:text-primary-foreground active:scale-95"
        >
          <Pencil size={18} />
        </button>
        <button
          type="button"
          aria-label="Удалить"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          className="grid h-12 w-12 place-items-center rounded-full bg-secondary/90 text-foreground shadow-lg backdrop-blur-md transition-colors hover:bg-destructive hover:text-white active:scale-95"
        >
          <Trash2 size={18} />
        </button>
      </motion.div>
    </>
  );
}
