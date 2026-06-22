import type { HTMLAttributes } from "react";

type CardVariant = "default" | "muted" | "elevated" | "highlight" | "interactive";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
};

const variantClasses: Record<CardVariant, string> = {
  default: "rounded-2xl border border-border bg-surface shadow-[var(--shadow-sm)]",
  muted: "rounded-2xl border border-border bg-surface-muted shadow-none",
  elevated: "rounded-2xl border border-border-strong bg-surface-elevated shadow-[var(--shadow-md)]",
  highlight:
    "rounded-2xl border border-primary/20 bg-surface shadow-[0_0_24px_rgba(255,90,31,0.1)]",
  interactive:
    "rounded-2xl border border-border bg-surface shadow-[var(--shadow-sm)] transition-[background-color,border-color,box-shadow] duration-200 ease-out hover:border-border-strong hover:bg-surface-elevated hover:shadow-[0_0_24px_rgba(255,90,31,0.08)]",
};

export function Card({
  className = "",
  variant = "default",
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "p-5 sm:p-6",
        variantClasses[variant],
        className,
      ].join(" ")}
      {...props}
    />
  );
}

export function CardHeader({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={["grid gap-2", className].join(" ")} {...props} />;
}

export function CardTitle({
  className = "",
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={["text-xl font-semibold tracking-tight text-foreground", className].join(
        " ",
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className = "",
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={["leading-7 text-muted-foreground", className].join(" ")}
      {...props}
    />
  );
}

export function CardContent({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={["mt-5", className].join(" ")} {...props} />;
}
