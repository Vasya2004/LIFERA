type ProgressProps = {
  className?: string;
  label?: string;
  size?: "compact" | "default" | "large";
  tone?: "primary" | "success" | "warning" | "muted";
  value: number;
};

const sizeClasses = {
  compact: "h-1.5",
  default: "h-2.5",
  large: "h-3",
};

const toneClasses = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  muted: "bg-border-strong",
};

export function Progress({
  className = "",
  label,
  size = "default",
  tone = "muted",
  value,
}: ProgressProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={["grid gap-2", className].join(" ")}>
      {label ? (
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="font-medium text-foreground">{label}</span>
          <span className="text-muted-foreground">{normalizedValue}%</span>
        </div>
      ) : null}
      <div
        aria-label={label}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={normalizedValue}
        className={[
          "overflow-hidden rounded-[var(--radius-progress)] bg-muted-surface",
          sizeClasses[size],
        ].join(" ")}
        role="progressbar"
      >
        <div
          className={[
            "h-full rounded-[var(--radius-progress)] transition-[width] duration-500 ease-out",
            toneClasses[tone],
          ].join(" ")}
          style={{ width: `${normalizedValue}%` }}
        />
      </div>
    </div>
  );
}
