import { HabitsCreateAction } from "@/components/habits/habits-create-action";
import { HabitsMissionsView } from "@/components/habits/habits-missions-view";
import { HabitsRhythmView } from "@/components/habits/habits-rhythm-view";
import { HabitsSidePanel } from "@/components/habits/habits-side-panel";
import { HabitsTodayView } from "@/components/habits/habits-today-view";
import { PageContent } from "@/components/layout/page-content";
import { getCurrentUser } from "@/lib/auth/session";
import { getHabitsPageData } from "@/lib/domain/habits-page";

type HabitsView = "today" | "missions";

const VALID_VIEWS = new Set<string>(["today", "missions"]);

const VIEW_ALIASES: Record<string, HabitsView> = {
  all: "missions",
  archive: "missions",
  rhythm: "today",
};

type HabitsPageProps = {
  searchParams: Promise<{ view?: string }>;
};

export default async function HabitsPage({ searchParams }: HabitsPageProps) {
  const params = await searchParams;
  const rawView = params.view ?? "";
  const view: HabitsView = VALID_VIEWS.has(rawView)
    ? (rawView as HabitsView)
    : (VIEW_ALIASES[rawView] ?? "today");

  const { supabase, user } = await getCurrentUser();
  let data: Awaited<ReturnType<typeof getHabitsPageData>> | null = null;
  let loadError: string | null = null;

  if (supabase && user) {
    try {
      data = await getHabitsPageData(supabase, user.id);
    } catch (error) {
      loadError =
        error instanceof Error ? error.message : "Не удалось загрузить привычки.";
    }
  }

  return (
    <PageContent aria-label="Привычки">
      <HabitsCreateAction skills={data?.skills ?? []} />

      <div
        aria-label={`Активный раздел привычек: ${view}`}
        className="grid min-w-0 gap-5 xl:gap-6"
        role="tabpanel"
      >
        {loadError ? (
          <div className="rounded-xl border border-danger/25 bg-danger-subtle p-4 text-sm text-danger-foreground">
            {loadError}
          </div>
        ) : null}

        {!data && !loadError ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-white/5 dark:bg-zinc-900/70">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Войдите, чтобы управлять привычками.
            </p>
          </div>
        ) : null}

        {data ? (
          <>
            {view === "today" ? (
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-6 2xl:grid-cols-[minmax(0,1fr)_340px]">
                <div className="grid min-w-0 content-start gap-5 xl:gap-6">
                  <HabitsTodayView checklist={data.checklist} summary={data.todaySummary} />
                  <HabitsRhythmView items={data.weeklyRhythm} summary={data.todaySummary} />
                </div>
                <aside className="min-w-0 self-start">
                  <HabitsSidePanel summary={data.todaySummary} />
                </aside>
              </div>
            ) : null}

            {view === "missions" ? (
              <HabitsMissionsView
                archivedHabits={data.archivedHabits}
                checklist={data.checklist}
                goals={data.goals}
              />
            ) : null}
          </>
        ) : null}
      </div>
    </PageContent>
  );
}
