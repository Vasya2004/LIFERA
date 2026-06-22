import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import type { AssistantAttentionArea } from "@/lib/domain/assistant-page";

type AssistantAttentionAreasProps = {
  areas: AssistantAttentionArea[];
};

export function AssistantAttentionAreas({ areas }: AssistantAttentionAreasProps) {
  const isPositive = areas.length === 1 && areas[0]?.tone === "positive";

  return (
    <Card className="grid gap-4">
      <SectionHeader
        description="Где системе нужна поддержка или всё идёт стабильно."
        title="Зоны внимания"
      />

      {isPositive ? (
        <p className="rounded-[var(--radius-control)] border border-[color:var(--border-primary-subtle)] bg-primary-subtle/20 px-4 py-4 text-sm leading-6 text-foreground">
          {areas[0].message}
        </p>
      ) : (
        <div className="grid gap-3">
          {areas.map((area) => (
            <div
              className="flex flex-col gap-3 rounded-[var(--radius-control)] border border-border bg-surface-muted/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              key={area.id}
            >
              <p className="text-sm text-foreground">{area.message}</p>
              {area.ctaHref && area.ctaLabel ? (
                <Link href={area.ctaHref}>
                  <Button className="w-full sm:w-auto" size="sm" variant="secondary">
                    {area.ctaLabel}
                  </Button>
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
