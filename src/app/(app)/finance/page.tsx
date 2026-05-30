import Link from "next/link";

import { PageTitle } from "@/components/layout/page-title";
import { BranchActivitiesSection } from "@/components/data/branch-activities-section";
import { BranchInsightCard } from "@/components/data/branch-insight-card";
import { CreateFinanceEntryForm } from "@/components/data/create-finance-entry-form";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/stat-card";
import { getCurrentUser } from "@/lib/auth/session";
import { formatDate } from "@/lib/domain/labels";
import { getFinanceBranchData } from "@/lib/domain/finance";

export const dynamic = "force-dynamic";

export default async function FinancePage() {
  const { supabase, user } = await getCurrentUser();
  let data: Awaited<ReturnType<typeof getFinanceBranchData>> | null = null;
  let loadError: string | null = null;

  if (supabase && user) {
    try {
      data = await getFinanceBranchData(supabase, user.id);
    } catch (error) {
      loadError = error instanceof Error ? error.message : "Не удалось загрузить финансовые данные.";
    }
  }

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-6 overflow-x-hidden px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="grid min-w-0 content-start gap-6">
        <PageTitle subtitle="Финансовые цели и устойчивость." title="Финансы" />

        <Card variant="muted">
          <p className="text-sm leading-6 text-muted-foreground">
            Раздел не является финансовой рекомендацией. Lifera помогает структурировать цели и
            snapshot накоплений — без инвестиционных советов и банковских интеграций.
          </p>
        </Card>

        {loadError ? (
          <Card className="border-danger/25 bg-danger-subtle">
            <p className="text-sm text-danger-foreground">{loadError}</p>
          </Card>
        ) : null}

        {!supabase || !user ? (
          <Card variant="muted">
            <p className="text-sm text-muted-foreground">Войдите, чтобы вести финансовый snapshot.</p>
          </Card>
        ) : null}

        {data ? (
          <>
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              <StatCard
                detail="индекс устойчивости"
                label="Stability score"
                progress={data.financeScore}
                value={`${data.financeScore}`}
              />
              <StatCard
                detail="накопления"
                label="Сейчас"
                value={`${data.latest?.savings_amount ?? 0}`}
              />
              <StatCard
                detail="цель"
                label="Target"
                value={`${data.latest?.target_amount ?? 0}`}
              />
              <StatCard
                detail="к цели"
                label="Progress"
                value={`${data.latest?.savingsProgress ?? 0}%`}
              />
            </div>

            <BranchInsightCard content={data.insight.content} title={data.insight.title} />

            {data.latest ? (
              <Card>
                <h2 className="text-xl font-semibold">Последний snapshot</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(data.latest.date) ?? data.latest.date}
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Доход / расход</p>
                    <p className="mt-1 font-semibold">
                      {data.latest.monthly_income} / {data.latest.monthly_expenses}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">Прогресс накоплений</p>
                    <Progress className="mt-2" tone="primary" value={data.latest.savingsProgress} />
                    <p className="mt-2 text-sm text-muted-foreground">
                      {data.latest.savings_amount} из {data.latest.target_amount || "—"}
                    </p>
                  </div>
                </div>
                {data.latest.note ? (
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{data.latest.note}</p>
                ) : null}
              </Card>
            ) : (
              <EmptyState description="Добавьте snapshot накоплений." title="Snapshot не задан">
                <Link className="text-sm font-semibold text-primary hover:underline" href="#finance-entry">
                  Добавить snapshot
                </Link>
              </EmptyState>
            )}

            {data.history.length > 1 ? (
              <Card>
                <h2 className="text-xl font-semibold">Недавние snapshots</h2>
                <div className="mt-4 grid gap-3">
                  {data.history.slice(1, 5).map((entry) => (
                    <div
                      className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-control)] border border-border bg-surface-muted px-4 py-3 text-sm"
                      key={entry.date}
                    >
                      <span className="font-medium">{formatDate(entry.date) ?? entry.date}</span>
                      <span className="text-muted-foreground">
                        {entry.savings_amount} / {entry.target_amount} · {entry.savingsProgress}%
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}

            <BranchActivitiesSection
              branch="finance"
              challenges={data.activities.challenges}
              goals={data.activities.goals}
              habits={data.activities.habits}
              title="Finance-активности"
            />
          </>
        ) : null}
      </div>

      <aside className="grid min-w-0 content-start gap-6">
        <Card id="finance-entry">
          <h2 className="text-xl font-semibold">Snapshot</h2>
          <div className="mt-4">
            {supabase && user ? (
              <CreateFinanceEntryForm />
            ) : (
              <p className="text-sm text-muted-foreground">Войдите, чтобы добавить snapshot.</p>
            )}
          </div>
        </Card>

        <Card variant="muted">
          <div className="grid gap-2">
            <Link className="text-sm font-semibold text-primary hover:underline" href="/progress">
              Смотреть прогресс
            </Link>
            <Link className="text-sm font-semibold text-primary hover:underline" href="/goals">
              Создать финансовую цель
            </Link>
          </div>
        </Card>
      </aside>
    </section>
  );
}
