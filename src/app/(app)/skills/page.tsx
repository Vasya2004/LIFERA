import Link from "next/link";

import { PageTitle } from "@/components/layout/page-title";
import { BranchActivitiesSection } from "@/components/data/branch-activities-section";
import { BranchInsightCard } from "@/components/data/branch-insight-card";
import { CreateSkillForm } from "@/components/data/create-skill-form";
import { SkillActions } from "@/components/data/skill-actions";
import { SkillCard } from "@/components/data/skill-card";
import { SkillEditForm } from "@/components/data/skill-edit-form";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { getCurrentUser } from "@/lib/auth/session";
import { getSkillsBranchData, SKILL_CATEGORIES } from "@/lib/domain/skills";

export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  const { supabase, user } = await getCurrentUser();
  let data: Awaited<ReturnType<typeof getSkillsBranchData>> | null = null;
  let loadError: string | null = null;

  if (supabase && user) {
    try {
      data = await getSkillsBranchData(supabase, user.id);
    } catch (error) {
      loadError = error instanceof Error ? error.message : "Не удалось загрузить навыки.";
    }
  }

  const activeSkills = data?.skills.filter((skill) => skill.status === "active") ?? [];
  const archivedSkills = data?.skills.filter((skill) => skill.status === "archived") ?? [];

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-6 overflow-x-hidden px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="grid min-w-0 content-start gap-6">
        <PageTitle subtitle="Компетенции, которые ты развиваешь." title="Навыки" />

        {loadError ? (
          <Card className="border-danger/25 bg-danger-subtle">
            <p className="text-sm text-danger-foreground">{loadError}</p>
          </Card>
        ) : null}

        {!supabase || !user ? (
          <Card variant="muted">
            <p className="text-sm text-muted-foreground">Войдите, чтобы управлять навыками.</p>
          </Card>
        ) : null}

        {data ? (
          <>
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
              <StatCard
                detail="активных"
                label="В фокусе"
                value={`${activeSkills.length}`}
              />
              <StatCard
                detail="средний progress"
                label="Progress"
                value={`${
                  activeSkills.length > 0
                    ? Math.round(
                        activeSkills.reduce((sum, skill) => sum + skill.computedProgress, 0) /
                          activeSkills.length,
                      )
                    : 0
                }%`}
              />
              <StatCard
                detail="сумма XP"
                label="XP навыков"
                value={`${activeSkills.reduce((sum, skill) => sum + skill.computedXp, 0)}`}
              />
            </div>

            <BranchInsightCard content={data.insight.content} title={data.insight.title} />

            {activeSkills.length > 0 ? (
              <div className="grid gap-4">
                <h2 className="text-xl font-semibold">Компетенции</h2>
                {activeSkills.map((skill) => (
                  <div className="grid gap-2" key={skill.id}>
                    <SkillCard skill={skill} />
                    <details className="rounded-[var(--radius-control)] border border-border bg-surface-muted px-4 py-3">
                      <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
                        Редактировать навык
                      </summary>
                      <SkillEditForm skill={skill} />
                    </details>
                    <SkillActions skillId={skill.id} />
                  </div>
                ))}
              </div>
            ) : !loadError ? (
              <EmptyState description="Добавьте первый навык." title="Пока нет навыков">
                <Link className="text-sm font-semibold text-primary hover:underline" href="#create-skill">
                  Добавить первый навык
                </Link>
              </EmptyState>
            ) : null}

            <BranchActivitiesSection
              branch="skills"
              challenges={data.developmentActivities.challenges}
              goals={data.developmentActivities.goals}
              habits={data.developmentActivities.habits}
              title="Связанная активность"
            />

            {archivedSkills.length > 0 ? (
              <div className="grid gap-4">
                <h2 className="text-xl font-semibold">Архив</h2>
                {archivedSkills.map((skill) => (
                  <Card key={skill.id} variant="muted">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{skill.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {SKILL_CATEGORIES[skill.category] ?? skill.category} · Lv {skill.computedLevel} ·{" "}
                          {skill.computedXp} XP
                        </p>
                      </div>
                      <Badge variant="muted">Архив</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      <aside className="grid min-w-0 content-start gap-6">
        <Card id="create-skill">
          <h2 className="text-xl font-semibold">Новый навык</h2>
          <div className="mt-4">
            {supabase && user ? (
              <CreateSkillForm />
            ) : (
              <p className="text-sm text-muted-foreground">Войдите, чтобы создавать навыки.</p>
            )}
          </div>
        </Card>

        <Card variant="muted">
          <Link className="text-sm font-semibold text-primary hover:underline" href="/progress">
            Смотреть прогресс
          </Link>
        </Card>
      </aside>
    </section>
  );
}
