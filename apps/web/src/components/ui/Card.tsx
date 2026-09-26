import { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface shadow-sm shadow-black/[0.02] ${className}`}
    >
      {children}
    </div>
  );
}
