import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ListItem } from "@/components/ui/list-item";
import { SectionHeader } from "@/components/ui/section-header";
import { formatLifeArea } from "@/lib/domain/labels";
import type { Challenge, Goal, Habit } from "@/lib/domain/types";

type BranchKind = "finance" | "health" | "skills";

type LinkedActivitiesOverviewProps = {
  branch: BranchKind;
  challenges: Challenge[];
  goals: Goal[];
  habits: Habit[];
};

const EMPTY_CTAS: Record<BranchKind, Array<{ href: string; label: string }>> = {
  finance: [
    { href: "/goals", label: "Создать цель" },
    { href: "/habits", label: "Создать привычку" },
  ],
  health: [
    { href: "/goals", label: "Создать цель" },
    { href: "/habits", label: "Создать привычку" },
  ],
  skills: [
    { href: "/goals", label: "Создать цель" },
    { href: "/habits", label: "Создать привычку" },
  ],
};

export function LinkedActivitiesOverview({
  branch,
  goals,
  habits,
}: LinkedActivitiesOverviewProps) {
  const hasAny = goals.length > 0 || habits.length > 0;

  return (
    <Card className="grid gap-5">
      <SectionHeader
        description="Цели и привычки, связанные с этой веткой."
        title="Связанные действия"
      />

      {!hasAny ? (
        <div className="grid gap-4">
          <p className="text-sm leading-6 text-muted-foreground">
            Свяжите ветку с целью или привычкой, чтобы Lifera могла видеть движение в этой сфере.
          </p>
          <div className="flex flex-wrap gap-2">
            {EMPTY_CTAS[branch].map((cta) => (
              <Link href={cta.href} key={cta.href + cta.label}>
                <Button className="w-full sm:w-auto" size="sm" variant="secondary">
                  {cta.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-3">
            {goals.slice(0, 4).map((goal) => (
              <ListItem
                action={
                  <Link href="/goals">
                    <Button size="sm" variant="secondary">
                      Цель
                    </Button>
                  </Link>
                }
                key={goal.id}
                meta={`${formatLifeArea(goal.life_area)} · ${goal.progress}%`}
                title={goal.title}
              />
            ))}
            {habits.slice(0, 4).map((habit) => (
              <ListItem
                action={
                  <Link href="/habits">
                    <Button size="sm" variant="secondary">
                      Привычка
                    </Button>
                  </Link>
                }
                key={habit.id}
                marker="success"
                meta={`${formatLifeArea(habit.life_area)} · серия ${habit.streak_current} дн.`}
                title={habit.title}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="muted">{goals.length} целей</Badge>
            <Badge variant="muted">{habits.length} привычек</Badge>
          </div>
        </>
      )}
    </Card>
  );
}
