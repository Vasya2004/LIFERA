import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ListItem } from "@/components/ui/list-item";
import { formatLifeArea } from "@/lib/domain/labels";
import type { Challenge, Goal, Habit } from "@/lib/domain/types";

type BranchKind = "finance" | "health" | "skills";

type BranchActivitiesSectionProps = {
  branch?: BranchKind;
  challenges: Challenge[];
  goals: Goal[];
  habits: Habit[];
  title: string;
};

const EMPTY_CTAS: Record<
  BranchKind,
  Array<{ href: string; label: string }>
> = {
  finance: [
    { href: "/goals", label: "Финансовая цель" },
    { href: "/habits", label: "Привычка учёта" },
  ],
  health: [
    { href: "/goals", label: "Цель здоровья" },
    { href: "/habits", label: "Привычка восстановления" },
  ],
  skills: [
    { href: "/goals", label: "Цель для навыка" },
    { href: "/habits", label: "Привычка прокачки" },
  ],
};

export function BranchActivitiesSection({
  branch,
  goals,
  habits,
  title,
}: BranchActivitiesSectionProps) {
  const hasAny = goals.length > 0 || habits.length > 0;
  const emptyCtas = branch ? EMPTY_CTAS[branch] : [];

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      {!hasAny ? (
        <div className="mt-4 grid gap-4">
          <p className="text-sm text-muted-foreground">
            Пока нет связанных целей или привычек в этой ветке.
          </p>
          {emptyCtas.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {emptyCtas.map((cta) => (
                <Link href={cta.href} key={cta.href + cta.label}>
                  <Button size="sm" variant="secondary">
                    {cta.label}
                  </Button>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-5 grid gap-3">
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
      )}

      {hasAny ? (
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge variant="muted">{goals.length} целей</Badge>
          <Badge variant="muted">{habits.length} привычек</Badge>
        </div>
      ) : null}
    </Card>
  );
}
