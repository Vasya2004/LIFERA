import type { ReactNode } from "react";

type TooltipProps = {
  children: ReactNode;
  label: string;
};

export function Tooltip({ children, label }: TooltipProps) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 hidden w-max max-w-56 -translate-x-1/2 rounded-[var(--radius-control)] border border-border-strong bg-surface-elevated px-3 py-2 text-xs font-medium text-foreground shadow-[var(--shadow-md)] group-hover:block group-focus-within:block">
        {label}
      </span>
    </span>
  );
}
