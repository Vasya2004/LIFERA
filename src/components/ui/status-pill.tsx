import type { HTMLAttributes } from "react";

type StatusVariant =
  | "active"
  | "planned"
  | "completed"
  | "paused"
  | "missed"
  | "locked"
  | "draft";

type StatusPillProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: StatusVariant;
};

const variantClasses: Record<StatusVariant, string> = {
  active: "border-warning/25 bg-warning-subtle text-warning-foreground",
  planned: "border-border bg-muted-surface text-muted-foreground",
  completed: "border-success/25 bg-success-subtle text-success-foreground",
  paused: "border-warning/25 bg-warning-subtle text-warning-foreground",
  missed: "border-danger/25 bg-danger-subtle text-danger-foreground",
  locked: "border-border bg-surface-muted text-muted-foreground",
  draft: "border-border bg-surface text-muted-foreground",
};

export function StatusPill({
  className = "",
  variant = "planned",
  ...props
}: StatusPillProps) {
  return (
    <span
      className={[
        "inline-flex min-h-6 w-fit items-center rounded-[var(--radius-badge)] border px-3 py-1 text-xs font-semibold leading-none",
        variantClasses[variant],
        className,
      ].join(" ")}
      {...props}
    />
  );
}
