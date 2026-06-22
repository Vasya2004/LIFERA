import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  FEATURE_MATRIX_LABELS,
  PLAN_FEATURE_MATRIX,
  PLAN_LABELS,
} from "@/lib/domain/plan-catalog";
import type { FeatureMatrixValue } from "@/lib/domain/plan-catalog";

const VALUE_VARIANTS: Record<FeatureMatrixValue, "muted" | "primary" | "success"> = {
  available: "success",
  limited: "primary",
  not_included: "muted",
  soon: "muted",
};

export function PlanFeatureMatrix() {
  return (
    <Card>
      <div className="grid gap-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Сравнение возможностей</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Что доступно на каждом уровне Lifera — без технических деталей.
          </p>
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 pr-4 font-medium text-muted-foreground">Возможность</th>
                {(["free", "pro", "ultra"] as const).map((tier) => (
                  <th className="px-3 py-3 font-semibold text-foreground" key={tier}>
                    {PLAN_LABELS[tier]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLAN_FEATURE_MATRIX.map((group) => (
                <MatrixGroupRows group={group} key={group.title} layout="table" />
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-4 lg:hidden">
          {PLAN_FEATURE_MATRIX.map((group) => (
            <MatrixGroupRows group={group} key={group.title} layout="stack" />
          ))}
        </div>
      </div>
    </Card>
  );
}

function MatrixGroupRows({
  group,
  layout,
}: {
  group: (typeof PLAN_FEATURE_MATRIX)[number];
  layout: "stack" | "table";
}) {
  if (layout === "table") {
    return (
      <>
        <tr className="border-b border-border/60">
          <td className="py-3 pr-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground" colSpan={4}>
            {group.title}
          </td>
        </tr>
        {group.rows.map((row) => (
          <tr className="border-b border-border/40" key={row.label}>
            <td className="py-3 pr-4 text-foreground">{row.label}</td>
            {(["free", "pro", "ultra"] as const).map((tier) => (
              <td className="px-3 py-3" key={tier}>
                <MatrixBadge value={row[tier]} />
              </td>
            ))}
          </tr>
        ))}
      </>
    );
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface-muted p-4">
      <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
      <ul className="mt-3 grid gap-3">
        {group.rows.map((row) => (
          <li className="grid gap-2 border-t border-border/50 pt-3 first:border-t-0 first:pt-0" key={row.label}>
            <span className="text-sm font-medium text-foreground">{row.label}</span>
            <div className="grid grid-cols-3 gap-2">
              {(["free", "pro", "ultra"] as const).map((tier) => (
                <div className="grid gap-1" key={tier}>
                  <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {PLAN_LABELS[tier]}
                  </span>
                  <MatrixBadge value={row[tier]} />
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MatrixBadge({ value }: { value: FeatureMatrixValue }) {
  return <Badge variant={VALUE_VARIANTS[value]}>{FEATURE_MATRIX_LABELS[value]}</Badge>;
}
