import Link from "next/link";

import { ChallengeProductCard } from "@/components/challenges/challenge-product-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import type { ChallengeWithMeta } from "@/lib/domain/challenges-page";
import type { Goal } from "@/lib/domain/types";

type ChallengesListProps = {
  active: ChallengeWithMeta[];
  archived: ChallengeWithMeta[];
  completed: ChallengeWithMeta[];
  goals: Array<Pick<Goal, "id" | "title">>;
  paused: ChallengeWithMeta[];
};

function CollapsibleSection({
  goals,
  items,
  title,
  variant,
}: {
  goals: Array<Pick<Goal, "id" | "title">>;
  items: ChallengeWithMeta[];
  title: string;
  variant: "active" | "compact";
}) {
  if (items.length === 0) {
    return null;
  }

  if (variant === "active") {
    return (
      <section className="grid gap-4">
        <SectionHeader title={title} />
        <div className="grid gap-4">
          {items.map((challenge) => (
            <ChallengeProductCard
              challenge={challenge}
              goals={goals}
              key={challenge.id}
              variant="active"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <details className="group rounded-[var(--radius-card)] border border-border bg-surface">
      <summary className="cursor-pointer list-none px-5 py-4 marker:content-none [&::-webkit-details-marker]:hidden">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <span className="text-sm text-muted-foreground">{items.length}</span>
        </div>
      </summary>
      <div className="grid gap-3 border-t border-border px-5 py-4">
        {items.map((challenge) => (
          <ChallengeProductCard
            challenge={challenge}
            goals={goals}
            key={challenge.id}
            variant="compact"
          />
        ))}
      </div>
    </details>
  );
}

export function ChallengesList({
  active,
  archived,
  completed,
  goals,
  paused,
}: ChallengesListProps) {
  const hasAny = active.length + paused.length + completed.length + archived.length > 0;

  if (!hasAny) {
    return (
      <EmptyState
        description="Создайте привычку, чтобы превратить цель в последовательность этапов."
        title="Нет активных привычек"
      >
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="#create-challenge">
            <Button className="w-full sm:w-auto">Создать привычку</Button>
          </Link>
          <Link href="#templates">
            <Button className="w-full sm:w-auto" variant="secondary">
              Выбрать шаблон
            </Button>
          </Link>
        </div>
      </EmptyState>
    );
  }

  return (
    <div className="grid gap-6">
      {active.length > 0 ? (
        <section className="grid gap-4">
          <SectionHeader title="Активные привычки" />
          <div className="grid gap-4">
            {active.map((challenge) => (
              <ChallengeProductCard challenge={challenge} goals={goals} key={challenge.id} />
            ))}
          </div>
        </section>
      ) : (
        <Card variant="muted">
          <SectionHeader title="Активные привычки" />
          <p className="mt-3 text-sm text-muted-foreground">
            Нет активных привычек. Возобновите паузу или создайте новую.
          </p>
          <Link className="mt-4 inline-flex w-full sm:w-auto" href="#create-challenge">
            <Button className="w-full sm:w-auto" size="sm">
              Создать привычку
            </Button>
          </Link>
        </Card>
      )}

      <CollapsibleSection goals={goals} items={paused} title="На паузе" variant="compact" />
      <CollapsibleSection goals={goals} items={completed} title="Завершённые" variant="compact" />
      <CollapsibleSection goals={goals} items={archived} title="Архив" variant="compact" />
    </div>
  );
}
