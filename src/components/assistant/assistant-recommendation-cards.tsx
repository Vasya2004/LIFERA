import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import {
  ASSISTANT_PRIORITY_LABELS,
  type AssistantRecommendationCard,
} from "@/lib/domain/assistant-page";

type AssistantRecommendationCardsProps = {
  cards: AssistantRecommendationCard[];
};

const priorityVariants = {
  high: "primary",
  low: "muted",
  medium: "muted",
} as const;

export function AssistantRecommendationCards({ cards }: AssistantRecommendationCardsProps) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-4">
      <SectionHeader
        description="Короткие подсказки по фокусу, привычкам, целям и достижениям."
        title="Рекомендации по зонам"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <Card key={card.id}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="muted">{card.categoryLabel}</Badge>
              <Badge variant={priorityVariants[card.priority]}>
                {ASSISTANT_PRIORITY_LABELS[card.priority]}
              </Badge>
            </div>
            <h3 className="mt-3 font-semibold text-foreground">{card.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.explanation}</p>
            <Link className="mt-4 inline-flex w-full sm:w-auto" href={card.ctaHref}>
              <Button size="sm" variant="secondary">
                {card.ctaLabel}
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}
