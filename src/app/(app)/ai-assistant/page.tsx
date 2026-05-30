import { PageTitle } from "@/components/layout/page-title";
import { AIRecommendationCard } from "@/components/ui/ai-recommendation-card";
import { getCurrentUser } from "@/lib/auth/session";
import { buildRuleBasedRecommendation } from "@/lib/domain/ai";

export default async function AiAssistantPage() {
  const { supabase, user } = await getCurrentUser();
  const recommendation =
    supabase && user
      ? await buildRuleBasedRecommendation(supabase, user.id).catch(() => null)
      : null;

  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:px-8">
      <PageTitle subtitle="Следующий шаг по вашим данным." title="AI Ассистент" />
      <AIRecommendationCard
        content={
          recommendation?.content ??
          "Создайте цель и челлендж, чтобы рекомендации стали персональными."
        }
        title={recommendation?.title ?? "Начните с данных"}
      />
    </section>
  );
}

