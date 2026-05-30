import type { ReactNode } from "react";

type ListItemProps = {
  action?: ReactNode;
  meta?: string;
  marker?: "primary" | "success" | "warning" | "muted";
  title: string;
};

const markerClasses = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  muted: "bg-border-strong",
};

export function ListItem({
  action,
  marker = "muted",
  meta,
  title,
}: ListItemProps) {
  return (
    <div className="flex min-h-12 items-center gap-3 rounded-[var(--radius-control)] border border-border bg-surface px-4 py-3 transition-colors hover:bg-surface-muted">
      <span
        aria-hidden="true"
        className={["h-2.5 w-2.5 rounded-full", markerClasses[marker]].join(" ")}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">{title}</p>
        {meta ? (
          <p className="mt-1 text-sm text-muted-foreground">{meta}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
