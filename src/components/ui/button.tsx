import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "link";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-transparent bg-primary text-primary-foreground shadow-[var(--shadow-sm)] hover:bg-[var(--primary-hover)]",
  secondary:
    "border border-border bg-surface text-foreground hover:border-border-strong hover:bg-surface-muted",
  ghost:
    "border border-transparent text-muted hover:bg-surface-muted hover:text-foreground",
  danger:
    "border border-danger/25 bg-danger text-white shadow-[var(--shadow-sm)] hover:bg-danger/90",
  link: "border border-transparent px-0 text-primary hover:text-[var(--primary-hover)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-[var(--button-height-sm)] px-3 text-sm",
  md: "h-[var(--button-height-md)] px-5 text-sm",
  lg: "h-[var(--button-height-lg)] px-6 text-base",
};

export function Button({
  className = "",
  disabled,
  loading = false,
  children,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--radius-control)] font-semibold transition-[background-color,border-color,color,box-shadow] duration-200 ease-out",
        "focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      ) : null}
      {children}
    </button>
  );
}
