import { ProgressAnalytics } from "@/components/data/progress-analytics";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import { getProgressData } from "@/lib/domain/progress";

export default async function ProgressPage() {
  const { supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return (
      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <Card variant="muted">
          <h1 className="text-3xl font-semibold tracking-tight">Прогресс</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Войдите в аккаунт, чтобы увидеть аналитику прокачки.
          </p>
        </Card>
      </section>
    );
  }

  let data = null;
  let loadError: string | null = null;

  try {
    data = await getProgressData(supabase, user.id);
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Не удалось загрузить аналитику прогресса.";
  }

  if (!data) {
    return (
      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <Card className="border-danger/25 bg-danger-subtle">
          <h1 className="text-3xl font-semibold tracking-tight text-danger-foreground">Прогресс</h1>
          <p className="mt-3 text-sm text-danger-foreground">{loadError}</p>
        </Card>
      </section>
    );
  }

  return <ProgressAnalytics data={{ ...data, loadError: data.loadError ?? loadError }} />;
}
