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
    { href: "/habits", label: "Ритуал учёта" },
    { href: "/challenges", label: "Финансовый челлендж" },
  ],
  health: [
    { href: "/goals", label: "Wellness-цель" },
    { href: "/habits", label: "Wellness-ритуал" },
    { href: "/challenges", label: "Health-челлендж" },
  ],
  skills: [
    { href: "/goals", label: "Цель для навыка" },
    { href: "/habits", label: "Ритуал прокачки" },
    { href: "/challenges", label: "Челлендж развития" },
  ],
};

export function BranchActivitiesSection({
  branch,
  challenges,
  goals,
  habits,
  title,
}: BranchActivitiesSectionProps) {
  const hasAny = goals.length > 0 || challenges.length > 0 || habits.length > 0;
  const emptyCtas = branch ? EMPTY_CTAS[branch] : [];

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Link className="text-sm font-semibold text-primary hover:underline" href="/progress">
          Прогресс
        </Link>
      </div>

      {!hasAny ? (
        <div className="mt-4 grid gap-4">
          <p className="text-sm text-muted-foreground">
            Пока нет связанных целей, челленджей или ритуалов в этой ветке.
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
          {challenges.slice(0, 4).map((challenge) => (
            <ListItem
              action={
                <Link href={`/challenges/${challenge.id}`}>
                  <Button size="sm" variant="secondary">
                    Миссия
                  </Button>
                </Link>
              }
              key={challenge.id}
              marker="primary"
              meta={`${challenge.progress}% · челлендж`}
              title={challenge.title}
            />
          ))}
          {habits.slice(0, 4).map((habit) => (
            <ListItem
              action={
                <Link href="/habits">
                  <Button size="sm" variant="secondary">
                    Ритуал
                  </Button>
                </Link>
              }
              key={habit.id}
              marker="success"
              meta={`${formatLifeArea(habit.life_area)} · streak ${habit.streak_current}`}
              title={habit.title}
            />
          ))}
        </div>
      )}

      {hasAny ? (
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge variant="muted">{goals.length} целей</Badge>
          <Badge variant="muted">{challenges.length} челленджей</Badge>
          <Badge variant="muted">{habits.length} ритуалов</Badge>
        </div>
      ) : null}
    </Card>
  );
}
