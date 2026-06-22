import Link from "next/link";
import { Link2, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardEmptyState,
  DashboardProgressBar,
  dashboardAccents,
  dashboardGhostButtonClass,
} from "@/components/dashboard/dashboard-card";
import type { Goal, Wish } from "@/lib/domain/types";

type DashboardMainWishProps = {
  goal: Goal | null;
  wish: Wish | null;
};

export function DashboardMainWish({ goal, wish }: DashboardMainWishProps) {
  if (!wish) {
    return (
      <DashboardCard accent="brand" className="lg:min-h-[300px]">
        <DashboardCardHeader accent="brand" icon={<Star />} title="Главное желание" />
        <DashboardEmptyState
          accent="brand"
          action={
            <Link href="/goals/wishes">
              <Button className={dashboardGhostButtonClass("brand")} size="sm" variant="secondary">Добавить желание</Button>
            </Link>
          }
          description="Свяжите желание с целью, чтобы усилить мотивацию."
          icon={<Star />}
          title="Главное желание не выбрано"
        />
      </DashboardCard>
    );
  }

  const targetAmount = Number(wish.target_amount ?? 0);
  const currentAmount = Number(wish.current_amount ?? 0);
  const progress = targetAmount > 0
    ? Math.min(100, Math.round((currentAmount / targetAmount) * 100))
    : 0;

  return (
    <DashboardCard accent="brand" className="lg:min-h-[300px]">
      <DashboardCardHeader accent="brand" icon={<Star />} title="Главное желание" />

      <div className="relative mt-5 grid gap-2">
        <h3 className="line-clamp-2 break-words text-xl font-semibold leading-tight text-zinc-950 dark:text-zinc-50">
          {wish.title}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Статус: {wish.status === "acquired" ? "Приобретено" : "Активно"}</p>
      </div>

      <div className="relative mt-auto grid gap-4 pt-5">
        <div className="grid gap-2">
          <p className={["text-lg font-semibold", dashboardAccents.brand.text].join(" ")}>{progress}% <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">к цели</span></p>
          <DashboardProgressBar accent="brand" value={progress} />
        </div>
        {goal ? (
          <div className="grid gap-1 text-sm">
            <p className="text-zinc-600 dark:text-zinc-400">Связано с целью:</p>
            <p className="flex min-w-0 items-center gap-2 text-zinc-950 dark:text-zinc-50">
              <Link2 className={["shrink-0", dashboardAccents.brand.text].join(" ")} size={16} />
              <span className="line-clamp-2 break-words">{goal.title}</span>
            </p>
          </div>
        ) : null}
        <Link href="/goals/wishes">
          <Button className={["w-full", dashboardGhostButtonClass("brand")].join(" ")} size="sm" variant="secondary">Открыть карту желаний</Button>
        </Link>
      </div>
    </DashboardCard>
  );
}
