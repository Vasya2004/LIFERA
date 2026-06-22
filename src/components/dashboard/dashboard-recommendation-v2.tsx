import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DashboardCard,
  DashboardCardHeader,
  dashboardGhostButtonClass,
} from "@/components/dashboard/dashboard-card";
import type { DashboardRecommendationAction } from "@/lib/domain/dashboard-focus";

type DashboardRecommendationV2Props = {
  action: DashboardRecommendationAction;
  content: string;
  title: string;
  xpToNextLevel: number;
};

export function DashboardRecommendationV2({
  action,
  content,
  xpToNextLevel,
}: DashboardRecommendationV2Props) {
  const text = xpToNextLevel > 0
    ? `До следующего уровня осталось ${xpToNextLevel} XP. ${content}`
    : content;

  return (
    <DashboardCard accent="recommendation" className="min-h-[160px] justify-between gap-5">
      <div className="min-w-0">
        <DashboardCardHeader accent="recommendation" icon={<Sparkles />} title="Рекомендация Lifera" />

        <p className="mt-4 line-clamp-3 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {text}
        </p>
      </div>

      <div className="shrink-0">
        <Link href={action.href}>
          <Button className={["px-5", dashboardGhostButtonClass("recommendation")].join(" ")} size="md" variant="secondary">
            {action.label}
          </Button>
        </Link>
      </div>
    </DashboardCard>
  );
}
