import type { ReactNode } from "react";

type ToastVariant = "success" | "info" | "warning" | "danger" | "progress" | "error";

type ToastProps = {
  children?: ReactNode;
  title: string;
  variant?: ToastVariant;
};

const variantClasses: Record<Exclude<ToastVariant, "progress" | "error">, string> = {
  success: "border-success/25 bg-success-subtle",
  info: "border-border-strong",
  warning: "border-warning/30 bg-warning-subtle",
  danger: "border-danger/30 bg-danger-subtle",
};

/** Inline toast-style block for static pages without provider */
export function Toast({ children, title, variant = "info" }: ToastProps) {
  const resolvedVariant =
    variant === "progress"
      ? "border-[color:var(--border-primary-subtle)] bg-primary-subtle"
      : variant === "error"
        ? variantClasses.danger
        : variantClasses[variant as keyof typeof variantClasses];

  return (
    <div
      className={[
        "rounded-[var(--radius-card)] border bg-surface-elevated p-4 shadow-[var(--shadow-md)]",
        resolvedVariant,
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

export { ToastProvider, useToast } from "@/components/ui/toast-provider";
export type { ToastAction, ToastInput, ToastVariant as LiveToastVariant } from "@/components/ui/toast-provider";
