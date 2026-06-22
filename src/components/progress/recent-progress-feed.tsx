import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import type { RecentProgressEvent } from "@/lib/domain/progress";

type RecentProgressFeedProps = {
  events: RecentProgressEvent[];
};

function formatWhen(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
  }).format(new Date(value));
}

export function RecentProgressFeed({ events }: RecentProgressFeedProps) {
  return (
    <Card className="grid gap-5">
      <SectionHeader
        description="Недавние шаги, ритуалы и достижения."
        title="Последние действия"
      />

      {events.length === 0 ? (
        <p className="rounded-[var(--radius-control)] border border-dashed border-border bg-surface-muted px-4 py-5 text-sm text-muted-foreground">
          Пока нет событий. Выполните ритуал или завершите этап привычки.
        </p>
      ) : (
        <div className="grid gap-3">
          {events.map((event) => (
            <div
              className="rounded-[var(--radius-control)] border border-border bg-surface-muted/70 px-4 py-3"
              key={event.id}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{event.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {event.description}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">{formatWhen(event.occurredAt)}</p>
                </div>
                {event.amount !== null ? (
                  <span className="shrink-0 font-semibold text-primary">+{event.amount}</span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
