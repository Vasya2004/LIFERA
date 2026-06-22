import { WishesBoard } from "@/components/goals/wishes-board";
import { PageContent } from "@/components/layout/page-content";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import { getWishesPageData } from "@/lib/domain/wishes-page";

export default async function GoalWishesPage() {
  const { supabase, user } = await getCurrentUser();
  let data: Awaited<ReturnType<typeof getWishesPageData>> | null = null;
  let loadError: string | null = null;

  if (supabase && user) {
    try {
      data = await getWishesPageData(supabase, user.id);
    } catch (error) {
      loadError = error instanceof Error ? error.message : "Не удалось загрузить карту желаний.";
    }
  }

  return (
    <PageContent className="min-h-[calc(100vh-var(--topbar-height))]">
      {loadError ? (
        <Card className="border-danger/25 bg-danger-subtle">
          <p className="text-sm text-danger-foreground">{loadError}</p>
        </Card>
      ) : null}

      {!supabase || !user ? (
        <Card variant="muted">
          <p className="text-sm text-muted-foreground">Войдите, чтобы управлять картой желаний.</p>
        </Card>
      ) : null}

      {data ? (
        <WishesBoard
          acquiredCount={data.acquiredCount}
          goals={data.goals}
          primaryWish={data.primaryWish}
          wishes={data.wishes}
        />
      ) : null}
    </PageContent>
  );
}
