import type { ReactNode } from "react";

type DropdownItem = {
  danger?: boolean;
  label: string;
};

type DropdownProps = {
  items: DropdownItem[];
  trigger: ReactNode;
};

export function Dropdown({ items, trigger }: DropdownProps) {
  return (
    <div className="group relative inline-flex">
      {trigger}
      <div className="absolute right-0 top-full z-40 mt-2 hidden min-w-48 rounded-[var(--radius-card)] border border-border-strong bg-surface-elevated p-1 shadow-[var(--shadow-md)] group-hover:block group-focus-within:block">
        {items.map((item) => (
          <button
            className={[
              "block w-full rounded-[calc(var(--radius-control)-4px)] px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-surface-muted",
              item.danger ? "text-danger" : "text-foreground",
            ].join(" ")}
            key={item.label}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
