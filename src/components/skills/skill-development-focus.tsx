import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SectionHeader } from "@/components/ui/section-header";
import { SKILL_CATEGORIES, type SkillWithActivities } from "@/lib/domain/skills";

type SkillDevelopmentFocusProps = {
  skills: SkillWithActivities[];
};

export function SkillDevelopmentFocus({ skills }: SkillDevelopmentFocusProps) {
  if (skills.length === 0) {
    return (
      <Card variant="muted">
        <SectionHeader
          description="Добавьте навыки — здесь появятся приоритеты для фокуса развития."
          title="Фокус развития"
        />
      </Card>
    );
  }

  return (
    <Card className="grid gap-4">
      <SectionHeader
        description="Навыки с наибольшим потенциалом роста на этой неделе."
        title="Фокус развития"
      />
      <div className="grid gap-3">
        {skills.map((skill) => {
          const unlinked = skill.linkedGoals.length === 0 && skill.linkedHabits.length === 0;
          const nextAction = unlinked
            ? "Свяжите с привычкой или целью"
            : skill.linkedHabits.length === 0
              ? "Добавьте привычку прокачки"
              : "Удерживайте регулярность";

          return (
            <div
              className="rounded-[var(--radius-control)] border border-border bg-surface-muted/70 px-4 py-4"
              key={skill.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{skill.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {SKILL_CATEGORIES[skill.category] ?? skill.category} · уровень{" "}
                    {skill.computedLevel}
                  </p>
                </div>
                <p className="metric-value text-xl text-primary">{skill.computedProgress}%</p>
              </div>
              <Progress className="mt-3" tone="primary" value={skill.computedProgress} />
              <p className="mt-3 text-sm text-muted-foreground">{nextAction}</p>
            </div>
          );
        })}
      </div>
      <Link href="/habits">
        <Button className="w-full sm:w-auto" size="sm" variant="secondary">
          Связать с привычкой
        </Button>
      </Link>
    </Card>
  );
}
