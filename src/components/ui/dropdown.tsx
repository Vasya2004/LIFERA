"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type DropdownItem = {
  danger?: boolean;
  label: string;
  onClick?: () => void;
};

type DropdownProps = {
  items: DropdownItem[];
  trigger: ReactNode;
};

export function Dropdown({ items, trigger }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [close, open]);

  return (
    <div className="relative inline-flex" ref={containerRef}>
      <div onClick={() => setOpen((prev) => !prev)}>
        {trigger}
      </div>
      {open ? (
        <div
          className="absolute right-0 top-full z-40 mt-2 min-w-48 rounded-[var(--radius-card)] border border-border-strong bg-surface-elevated p-1 shadow-[var(--shadow-md)]"
          role="menu"
        >
          {items.map((item) => (
            <button
              className={[
                "block w-full rounded-[calc(var(--radius-control)-4px)] px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-surface-muted",
                item.danger ? "text-danger" : "text-foreground",
              ].join(" ")}
              key={item.label}
              onClick={() => {
                item.onClick?.();
                close();
              }}
              role="menuitem"
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
