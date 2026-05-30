import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SKILL_CATEGORIES, type SkillWithActivities } from "@/lib/domain/skills";

type SkillCardProps = {
  skill: SkillWithActivities;
};

export function SkillCard({ skill }: SkillCardProps) {
  const categoryLabel = SKILL_CATEGORIES[skill.category] ?? skill.category;
  const hasLinks =
    skill.linkedGoals.length > 0 ||
    skill.linkedChallenges.length > 0 ||
    skill.linkedHabits.length > 0;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">{skill.title}</h3>
            <Badge variant={skill.status === "active" ? "success" : "muted"}>
              {skill.status === "active" ? "В фокусе" : "В архиве"}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{categoryLabel}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm text-muted-foreground">Уровень</p>
          <p className="text-2xl font-semibold text-foreground">{skill.computedLevel}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">Progress</p>
          <p className="mt-1 font-semibold">{skill.computedProgress}%</p>
          <Progress className="mt-2" tone="primary" value={skill.computedProgress} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">XP</p>
          <p className="mt-1 font-semibold">{skill.computedXp}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Связи</p>
          <p className="mt-1 text-sm text-foreground">
            {skill.linkedGoals.length} · {skill.linkedChallenges.length} · {skill.linkedHabits.length}
          </p>
          <p className="text-xs text-muted-foreground">цели · челленджи · ритуалы</p>
        </div>
      </div>

      {hasLinks ? (
        <div className="mt-4 grid gap-2 border-t border-border pt-4 text-sm">
          {skill.linkedGoals.slice(0, 2).map((goal) => (
            <div className="flex flex-wrap items-center justify-between gap-2" key={goal.id}>
              <span className="min-w-0 truncate text-muted-foreground">Цель: {goal.title}</span>
              <Link className="shrink-0 text-primary hover:underline" href="/goals">
                Открыть
              </Link>
            </div>
          ))}
          {skill.linkedChallenges.slice(0, 2).map((challenge) => (
            <div className="flex flex-wrap items-center justify-between gap-2" key={challenge.id}>
              <span className="min-w-0 truncate text-muted-foreground">
                Челлендж: {challenge.title}
              </span>
              <Link
                className="shrink-0 text-primary hover:underline"
                href={`/challenges/${challenge.id}`}
              >
                Открыть
              </Link>
            </div>
          ))}
          {skill.linkedHabits.slice(0, 2).map((habit) => (
            <div className="flex flex-wrap items-center justify-between gap-2" key={habit.id}>
              <span className="min-w-0 truncate text-muted-foreground">Ритуал: {habit.title}</span>
              <Link className="shrink-0 text-primary hover:underline" href="/habits">
                Открыть
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          Навык пока не связан с квестами и ритуалами.
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <Link href="/goals">
          <Button size="sm" variant="secondary">
            Цель
          </Button>
        </Link>
        <Link href="/habits">
          <Button size="sm" variant="secondary">
            Ритуал
          </Button>
        </Link>
        <Link href="/challenges">
          <Button size="sm" variant="secondary">
            Челлендж
          </Button>
        </Link>
      </div>
    </Card>
  );
}
