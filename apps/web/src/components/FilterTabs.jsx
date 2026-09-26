'use client';

export default function FilterTabs({ items, activeKey, onChange }) {
  return (
    <div className="-mx-1 mb-5 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none sm:mb-6 sm:flex-wrap sm:overflow-visible">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onChange(item.key)}
          className={`shrink-0 rounded-lg px-3 py-1.5 font-inter text-sm transition-colors ${
            activeKey === item.key
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-muted-foreground hover:text-foreground'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
