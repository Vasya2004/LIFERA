import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { DashboardRecommendationAction } from "@/lib/domain/dashboard-focus";

type DashboardRecommendationProps = {
  action: DashboardRecommendationAction;
  content: string;
  title: string;
};

export function DashboardRecommendation({ action, content, title }: DashboardRecommendationProps) {
  return (
    <Card className="assistant-surface grid gap-4 border p-5 sm:p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--assistant)]">
        Рекомендация Lifera
      </p>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{content}</p>
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Почему:</span> {action.reason}
      </p>
      <Link className="inline-flex w-full sm:w-auto" href={action.href}>
        <Button className="w-full gap-2 sm:w-auto" variant="secondary">
          {action.label}
        </Button>
      </Link>
    </Card>
  );
}
