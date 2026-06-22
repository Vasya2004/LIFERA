import { Activity, Leaf, Moon, Wind, Zap } from "lucide-react";

import { HealthBodyMap } from "@/components/health/health-body-map";
import { HealthCreateAction } from "@/components/health/health-create-action";
import { HealthDynamicsView } from "@/components/health/health-dynamics-view";
import { HealthGoal } from "@/components/health/health-goal";
import { HealthHero } from "@/components/health/health-hero";
import { HealthInsight } from "@/components/health/health-insight";
import { HealthJournal } from "@/components/health/health-journal";
import { HealthLatestEntry } from "@/components/health/health-latest-entry";
import { HealthMetricCard } from "@/components/health/health-metric-card";
import { HealthProblemZones } from "@/components/health/health-problem-zones";
import { PageContent } from "@/components/layout/page-content";
import { getCurrentUser } from "@/lib/auth/session";
import { getHealthBranchData } from "@/lib/domain/health";
import { todayIsoDate } from "@/lib/utils/date";

export const dynamic = "force-dynamic";

type HealthView = "overview" | "body-map" | "history";

type HealthPageProps = {
  searchParams: Promise<{ view?: string }>;
};

function parseHealthView(view?: string): HealthView {
  if (view === "body-map") return "body-map";
  if (view === "history") return "history";
  return "overview";
}

function QuickCheckinCard({ hasTodayEntry }: { hasTodayEntry: boolean }) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/5 dark:bg-zinc-900/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
            Ежедневный check-in
          </h2>
          <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Один раз в день зафиксируйте энергию, сон, восстановление, стресс и активность.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-orange-200/60 bg-orange-50 text-orange-600 dark:border-orange-500/15 dark:bg-orange-500/10 dark:text-orange-400">
            <Activity aria-hidden="true" size={18} />
          </span>
          {hasTodayEntry ? (
            <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-500/10 dark:text-green-400">
              Сегодня заполнено
            </span>
          ) : (
            <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              Сегодня не заполнено
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

export default async function HealthPage({ searchParams }: HealthPageProps) {
  const params = await searchParams;
  const view = parseHealthView(params.view);

  const { supabase, user } = await getCurrentUser();
  let data: Awaited<ReturnType<typeof getHealthBranchData>> | null = null;
  let loadError: string | null = null;

  if (supabase && user) {
    try {
      data = await getHealthBranchData(supabase, user.id);
    } catch (error) {
      loadError =
        error instanceof Error ? error.message : "Не удалось загрузить данные здоровья.";
    }
  }

  const latest = data?.latest ?? null;
  const wellnessScore = latest !== null ? (data?.wellnessScore ?? null) : null;
  const history = data?.history ?? [];
  const allHistory = data?.allHistory ?? [];
  const hasEnoughForDynamics = data?.hasEnoughDataForDynamics ?? false;

  const energyVal = latest ? Math.round(latest.energy_level * 10) : null;
  const sleepVal = latest ? Math.round((latest.sleep_hours / 8) * 100) : null;
  const recoveryVal = latest ? Math.round(latest.recovery_score * 10) : null;
  const stressVal = latest ? Math.max(0, Math.round(100 - latest.recovery_score * 10)) : null;

  const notAuthenticated = !supabase || !user;

  const hasTodayEntry = latest?.date === todayIsoDate();

  return (
    <PageContent aria-label="Здоровье" role="main">
      <HealthCreateAction hasTodayEntry={hasTodayEntry} />

      <div
        aria-label={`Активный раздел здоровья: ${view}`}
        className="grid min-w-0 gap-5 xl:gap-6"
        role="tabpanel"
      >
        {loadError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            {loadError}
          </div>
        ) : null}

        {notAuthenticated ? (
          <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            Войдите, чтобы вести журнал состояния.
          </div>
        ) : null}

        {/* ── Обзор ─────────────────────────────────────────────────────────── */}
        {view === "overview" && data ? (
          <div
            aria-label="Обзор самочувствия"
            className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-6 2xl:grid-cols-[minmax(0,1fr)_340px]"
          >
            {/* Main column */}
            <div className="grid min-w-0 content-start gap-5 xl:gap-6">
              <HealthHero latest={latest} wellnessScore={wellnessScore} />

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <HealthMetricCard
                  empty={energyVal === null}
                  icon={<Zap className="text-amber-500" size={15} />}
                  iconBg="bg-amber-50 dark:bg-amber-500/10"
                  label="Энергия"
                  progressColor="bg-amber-500"
                  value={energyVal}
                />
                <HealthMetricCard
                  empty={sleepVal === null}
                  icon={<Moon className="text-blue-500" size={15} />}
                  iconBg="bg-blue-50 dark:bg-blue-500/10"
                  label="Сон"
                  progressColor="bg-blue-500"
                  value={sleepVal}
                />
                <HealthMetricCard
                  empty={recoveryVal === null}
                  icon={<Leaf className="text-green-500" size={15} />}
                  iconBg="bg-green-50 dark:bg-green-500/10"
                  label="Восстановление"
                  progressColor="bg-green-500"
                  value={recoveryVal}
                />
                <HealthMetricCard
                  empty={stressVal === null}
                  icon={<Wind className="text-rose-500" size={15} />}
                  iconBg="bg-rose-50 dark:bg-rose-500/10"
                  label="Стресс"
                  progressColor="bg-rose-500"
                  stressInverted
                  value={stressVal}
                />
              </div>

              <QuickCheckinCard hasTodayEntry={hasTodayEntry} />

              <div aria-label="Динамика недели">
                <HealthDynamicsView
                  allHistory={allHistory}
                  hasEnoughData={hasEnoughForDynamics}
                />
              </div>
            </div>

            {/* Right column */}
            <aside className="min-w-0 self-start">
              <div className="grid gap-5 xl:sticky xl:top-[calc(var(--topbar-height)+1rem)]">
                <HealthInsight history={history} latest={latest} />
                <HealthProblemZones />
                <HealthLatestEntry latest={latest} />
                <HealthGoal current={wellnessScore} target={80} />
              </div>
            </aside>
          </div>
        ) : null}

        {/* ── Карта тела ────────────────────────────────────────────────────── */}
        {view === "body-map" ? (
          <div aria-label="Карта тела">
            <HealthBodyMap />
          </div>
        ) : null}

        {/* ── История ───────────────────────────────────────────────────────── */}
        {view === "history" ? (
          <div aria-label="История записей">
            <HealthJournal entries={allHistory} />
          </div>
        ) : null}
      </div>
    </PageContent>
  );
}
