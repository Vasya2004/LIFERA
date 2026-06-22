import type { ReactNode } from "react";

type MetricCellProps = {
  label: string;
  value: ReactNode;
  size?: "md" | "lg";
};

export function MetricCell({ label, size = "lg", value }: MetricCellProps) {
  return (
    <div className="rounded-[var(--radius-control)] border border-border bg-surface-muted/70 px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={[
          "metric-value mt-1 text-foreground",
          size === "lg" ? "text-2xl" : "text-xl",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

export function MetricGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}
