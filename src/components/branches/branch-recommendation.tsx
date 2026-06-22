import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PageHeroCard } from "@/components/ui/page-hero-card";
import type { BranchRecommendation } from "@/lib/domain/branches";

type BranchRecommendationBlockProps = {
  recommendation: BranchRecommendation;
};

export function BranchRecommendationBlock({ recommendation }: BranchRecommendationBlockProps) {
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
