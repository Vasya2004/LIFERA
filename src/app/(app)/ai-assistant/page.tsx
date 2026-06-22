import { AssistantChat } from "@/components/assistant/assistant-chat";
import { PageContent } from "@/components/layout/page-content";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import { getAssistantPageData } from "@/lib/domain/assistant-page";

export default async function AiAssistantPage() {
  const { supabase, user } = await getCurrentUser();
  let data: Awaited<ReturnType<typeof getAssistantPageData>> | null = null;
  let loadError: string | null = null;

  if (supabase && user) {
    try {
      data = await getAssistantPageData(supabase, user.id);
    } catch (error) {
      loadError = error instanceof Error ? error.message : "Не удалось загрузить данные ассистента.";
    }
  }

  if (loadError) {
    return (
      <PageContent className="flex min-h-[calc(100vh-var(--topbar-height))] items-center justify-center">
        <Card className="border-danger/25 bg-danger-subtle">
          <p className="text-sm text-danger-foreground">{loadError}</p>
        </Card>
      </PageContent>
    );
  }

  if (!supabase || !user || !data) {
    return (
      <PageContent className="flex min-h-[calc(100vh-var(--topbar-height))] items-center justify-center">
        <Card variant="muted">
          <p className="text-sm text-muted-foreground">Войдите, чтобы использовать ассистента.</p>
        </Card>
      </PageContent>
    );
  }

  return <AssistantChat data={data} />;
}
