import Link from "next/link";

import { PageTitle } from "@/components/layout/page-title";
import { BranchActivitiesSection } from "@/components/data/branch-activities-section";
import { BranchInsightCard } from "@/components/data/branch-insight-card";
import { CreateHealthEntryForm } from "@/components/data/create-health-entry-form";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/stat-card";
import { getCurrentUser } from "@/lib/auth/session";
import { formatDate } from "@/lib/domain/labels";
import { getHealthBranchData } from "@/lib/domain/health";

export const dynamic = "force-dynamic";

export default async function HealthPage() {
  const { supabase, user } = await getCurrentUser();
  let data: Awaited<ReturnType<typeof getHealthBranchData>> | null = null;
  let loadError: string | null = null;

  if (supabase && user) {
    try {
      data = await getHealthBranchData(supabase, user.id);
    } catch (error) {
      loadError = error instanceof Error ? error.message : "Не удалось загрузить wellness-данные.";
    }
  }

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-6 overflow-x-hidden px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="grid min-w-0 content-start gap-6">
        <PageTitle subtitle="Wellness-ветка без медицинских рекомендаций." title="Здоровье" />

        <Card variant="muted">
          <p className="text-sm leading-6 text-muted-foreground">
            Раздел не является медицинской рекомендацией. Lifera помогает отслеживать wellness и
            связь с целями — без диагнозов и лечения.
          </p>
        </Card>

        {loadError ? (
          <Card className="border-danger/25 bg-danger-subtle">
            <p className="text-sm text-danger-foreground">{loadError}</p>
          </Card>
        ) : null}

        {!supabase || !user ? (
          <Card variant="muted">
            <p className="text-sm text-muted-foreground">Войдите, чтобы вести wellness-журнал.</p>
          </Card>
        ) : null}

        {data ? (
          <>
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              <StatCard
                detail="сводный индекс"
                label="Wellness score"
                progress={data.wellnessScore}
                value={`${data.wellnessScore}`}
              />
              <StatCard
                detail="1–10"
                label="Энергия"
                value={`${data.latest?.energy_level ?? "—"}`}
              />
              <StatCard
                detail="часы"
                label="Сон"
                value={`${data.latest?.sleep_hours ?? "—"}`}
              />
              <StatCard
                detail="минуты"
                label="Активность"
                value={`${data.latest?.activity_minutes ?? "—"}`}
              />
            </div>

            <BranchInsightCard content={data.insight.content} title={data.insight.title} />

            {data.latest ? (
              <Card>
                <h2 className="text-xl font-semibold">Последняя запись</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(data.latest.date) ?? data.latest.date}
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Восстановление</p>
                    <p className="mt-1 text-2xl font-semibold">{data.latest.recovery_score}/10</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">Wellness progress</p>
                    <Progress className="mt-2" tone="success" value={data.wellnessScore} />
                  </div>
                </div>
                {data.latest.note ? (
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{data.latest.note}</p>
                ) : null}
              </Card>
            ) : (
              <EmptyState description="Добавьте первую запись." title="Журнал пуст">
                <Link className="text-sm font-semibold text-primary hover:underline" href="#health-entry">
                  Добавить запись
                </Link>
              </EmptyState>
            )}

            {data.history.length > 1 ? (
              <Card>
                <h2 className="text-xl font-semibold">Недавняя динамика</h2>
                <div className="mt-4 grid gap-3">
                  {data.history.slice(1, 5).map((entry) => (
                    <div
                      className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-control)] border border-border bg-surface-muted px-4 py-3 text-sm"
                      key={entry.date}
                    >
                      <span className="font-medium">{formatDate(entry.date) ?? entry.date}</span>
                      <span className="text-muted-foreground">
                        E {entry.energy_level} · S {entry.sleep_hours}ч · A {entry.activity_minutes}м
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}

            <BranchActivitiesSection
              branch="health"
              challenges={data.activities.challenges}
              goals={data.activities.goals}
              habits={data.activities.habits}
              title="Wellness-активности"
            />
          </>
        ) : null}
      </div>

      <aside className="grid min-w-0 content-start gap-6">
        <Card id="health-entry">
          <h2 className="text-xl font-semibold">Wellness-запись</h2>
          <div className="mt-4">
            {supabase && user ? (
              <CreateHealthEntryForm />
            ) : (
              <p className="text-sm text-muted-foreground">Войдите, чтобы добавить запись.</p>
            )}
          </div>
        </Card>

        <Card variant="muted">
          <div className="grid gap-2">
            <Link className="text-sm font-semibold text-primary hover:underline" href="/progress">
              Смотреть прогресс
            </Link>
            <Link className="text-sm font-semibold text-primary hover:underline" href="/habits">
              Создать wellness-ритуал
            </Link>
          </div>
        </Card>
      </aside>
    </section>
  );
}
