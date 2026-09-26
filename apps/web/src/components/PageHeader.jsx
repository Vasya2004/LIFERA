'use client';

import { Plus } from 'lucide-react';

export default function PageHeader({ title, onAdd }) {
  return (
    <div className="flex items-center justify-between gap-3 py-5 sm:gap-4 sm:py-6 md:py-8">
      <h1 className="min-w-0 truncate font-bebas text-4xl tracking-wide sm:text-5xl md:text-6xl lg:text-7xl">
        {title}
      </h1>
      <button
        type="button"
        onClick={onAdd}
        className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-3 py-2.5 font-inter text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:px-4"
      >
        <Plus size={16} />
        <span className="hidden sm:inline">Добавить</span>
      </button>
    </div>
  );
}
