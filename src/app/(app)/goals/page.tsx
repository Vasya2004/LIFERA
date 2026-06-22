import { GoalCreateModal } from "@/components/goals/goal-create-modal";
import { GoalsList } from "@/components/goals/goals-list";
import { GoalsSummary } from "@/components/goals/goals-summary";
import { PageActionRegistration } from "@/components/layout/page-actions";
import { PageContent, PageGrid } from "@/components/layout/page-content";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import { getGoalsPageData } from "@/lib/domain/goals-page";

export default async function GoalsPage() {
  const { supabase, user } = await getCurrentUser();
  let data: Awaited<ReturnType<typeof getGoalsPageData>> | null = null;
  let loadError: string | null = null;

  if (supabase && user) {
    try {
      data = await getGoalsPageData(supabase, user.id);
    } catch (error) {
      loadError = error instanceof Error ? error.message : "Не удалось загрузить цели.";
    }
  }

  const primaryItem =
    data?.active.find((item) => item.isPrimary) ??
    data?.active[0] ??
    data?.backlog.find((item) => item.isPrimary) ??
    null;
  const activeMissionCount =
    data?.active.reduce(
      (sum, item) =>
        sum + item.goal.linkedChallenges.filter((challenge) => challenge.status === "active").length,
      0,
    ) ?? 0;

  return (
    <PageContent className="min-h-[calc(100vh-var(--topbar-height))]">
      {supabase && user ? (
        <PageActionRegistration actions={<GoalCreateModal wishes={data?.wishes ?? []} />} />
      ) : null}

      {loadError ? (
        <Card className="border-danger/25 bg-danger-subtle">
          <p className="text-sm text-danger-foreground">{loadError}</p>
        </Card>
      ) : null}

      {!supabase || !user ? (
        <Card variant="muted">
          <p className="text-sm text-muted-foreground">Войдите, чтобы управлять целями.</p>
        </Card>
      ) : null}

      {data ? (
        <PageGrid>
          <GoalsSummary
            activeMissionCount={activeMissionCount}
            primaryItem={primaryItem}
            summary={data.summary}
          />
          <div className="col-span-12 min-w-0" id="all-goals">
            <GoalsList
              active={data.active}
              archived={data.archived}
              backlog={data.backlog}
              completed={data.completed}
              wishes={data.wishes}
            />
          </div>
        </PageGrid>
      ) : null}
    </PageContent>
  );
}
