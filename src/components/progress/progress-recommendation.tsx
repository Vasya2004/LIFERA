import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PageHeroCard } from "@/components/ui/page-hero-card";
import type { ProgressRecommendation } from "@/lib/domain/progress";

type ProgressRecommendationProps = {
  recommendation: ProgressRecommendation;
};

export function ProgressRecommendationBlock({ recommendation }: ProgressRecommendationProps) {
  return (
    <PageHeroCard hint={recommendation.content} title="Следующий шаг" variant="highlight">
      <p className="text-lg font-semibold text-foreground">{recommendation.title}</p>
      <Link href={recommendation.ctaHref}>
        <Button size="sm">
          {recommendation.ctaLabel}
        </Button>
      </Link>
    </PageHeroCard>
  );
}
