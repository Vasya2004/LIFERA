import type { HTMLAttributes } from "react";

type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "muted"
  | "gold";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  default: "border-border bg-surface text-foreground",
  primary: "border-[color:var(--border-primary-subtle)] bg-primary-subtle text-primary",
  success: "border-success/25 bg-success-subtle text-success-foreground",
  warning: "border-warning/25 bg-warning-subtle text-warning-foreground",
  danger: "border-danger/25 bg-danger-subtle text-danger-foreground",
  muted: "border-border bg-muted-surface text-muted-foreground",
  gold: "border-[color:var(--accent-gold)]/40 bg-warning-subtle text-warning-foreground",
};

export function Badge({
  className = "",
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex min-h-6 w-fit items-center rounded-[var(--radius-badge)] border px-3 py-1 text-xs font-medium leading-none",
        variantClasses[variant],
        className,
      ].join(" ")}
      {...props}
    />
  );
}
