import type { ReactNode } from "react";

type ToastVariant = "success" | "info" | "warning" | "danger";

type ToastProps = {
  children?: ReactNode;
  title: string;
  variant?: ToastVariant;
};

const variantClasses: Record<ToastVariant, string> = {
  success: "border-success/25 bg-success-subtle",
  info: "border-border-strong",
  warning: "border-warning/30 bg-warning-subtle",
  danger: "border-danger/30 bg-danger-subtle",
};

export function Toast({ children, title, variant = "info" }: ToastProps) {
  return (
    <div
      className={[
        "rounded-[var(--radius-card)] border bg-surface-elevated p-4 shadow-[var(--shadow-md)]",
        variantClasses[variant],
      ].join(" ")}
      role="status"
    >
      <p className="font-semibold text-foreground">{title}</p>
      {children ? (
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{children}</p>
      ) : null}
    </div>
  );
}
