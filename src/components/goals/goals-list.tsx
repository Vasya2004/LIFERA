import { GoalProductCard } from "@/components/goals/goal-product-card";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import type { GoalListItem } from "@/lib/domain/goals-page";
import type { Wish } from "@/lib/domain/types";

type GoalsListProps = {
  active: GoalListItem[];
  archived: GoalListItem[];
  backlog: GoalListItem[];
  completed: GoalListItem[];
  wishes: Wish[];
};

function CollapsibleSection({
  defaultOpen = false,
  id,
  items,
  title,
  variant,
  wishes,
}: {
  defaultOpen?: boolean;
  id?: string;
  items: GoalListItem[];
  title: string;
  variant: "active" | "compact";
  wishes: Wish[];
}) {
  if (items.length === 0) {
    return null;
  }

  if (variant === "active") {
    return (
      <section className="grid gap-4" id={id}>
        <SectionHeader title={title} />
        <div className="grid auto-rows-fr gap-4 md:grid-cols-2">
          {items.map((item) => (
            <GoalProductCard key={item.goal.id} {...item} variant="active" wishes={wishes} />
          ))}
        </div>
      </section>
    );
  }

  return (
  <details
    className="group rounded-2xl border border-zinc-200 bg-white dark:border-white/5 dark:bg-zinc-900/70"
    id={id}
    open={defaultOpen}
  >
      <summary className="cursor-pointer list-none px-5 py-4 marker:content-none [&::-webkit-details-marker]:hidden">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">{title}</h2>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">{items.length}</span>
        </div>
      </summary>
      <div className="grid gap-3 border-t border-zinc-200 px-5 py-4 dark:border-white/5">
        {items.map((item) => (
          <GoalProductCard key={item.goal.id} {...item} variant="compact" wishes={wishes} />
        ))}
      </div>
    </details>
  );
}

export function GoalsList({ active, archived, backlog, completed, wishes }: GoalsListProps) {
  const hasAny = active.length + backlog.length + completed.length + archived.length > 0;

  if (!hasAny) {
    return (
      <EmptyState
        description="Создайте первую цель или завершите onboarding — Lifera соберёт вокруг неё привычки и фокус."
        title="Пока нет целей"
      />
    );
  }

  return (
    <div className="grid gap-6">
      {active.length > 0 ? (
        <CollapsibleSection
          id="active-goals"
          items={active}
          title="Активные цели"
          variant="active"
          wishes={wishes}
        />
      ) : (
        <Card id="active-goals" variant="muted">
          <SectionHeader title="Активные цели" />
          <p className="mt-3 text-sm text-muted-foreground">
            Нет активных целей. Переведите цель из «В планах» или создайте новую.
          </p>
        </Card>
      )}

      <CollapsibleSection
        id="backlog-goals"
        items={backlog}
        title="В планах"
        variant="compact"
        wishes={wishes}
      />
      <CollapsibleSection
        id="completed-goals"
        items={completed}
        title="Завершённые"
        variant="compact"
        wishes={wishes}
      />
      <CollapsibleSection items={archived} title="Архив" variant="compact" wishes={wishes} />
    </div>
  );
}
