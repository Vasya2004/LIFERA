"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlanLimitAlert } from "@/components/ui/plan-limit-alert";
import { SectionHeader } from "@/components/ui/section-header";
import { isPlanLimitPayload } from "@/lib/api/plan-limit";
import { DIFFICULTY_LABELS } from "@/lib/domain/labels";
import type { Challenge } from "@/lib/domain/types";
import type { Goal } from "@/lib/domain/types";

type ChallengeTemplatesSectionProps = {
  goals: Array<Pick<Goal, "id" | "title">>;
  templates: Challenge[];
};

function estimateStageCount(template: Challenge) {
  if (template.xp_reward_total > 0) {
    const estimated = Math.round(template.xp_reward_total / 80);
    if (estimated > 0) {
      return estimated;
    }
  }

  return 5;
}

export function ChallengeTemplatesSection({ goals, templates }: ChallengeTemplatesSectionProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPlanLimit, setIsPlanLimit] = useState(false);

  const visibleTemplates = templates.slice(0, 6);

  if (visibleTemplates.length === 0) {
    return null;
  }

  async function startFromTemplate(template: Challenge) {
    if (loadingId) {
      return;
    }

    setLoadingId(template.id);
    setMessage(null);
    setIsPlanLimit(false);

    const response = await fetch("/api/challenges", {
      body: JSON.stringify({
        goal_id: goals[0]?.id ?? null,
        template_id: template.id,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    const payload = await response.json().catch(() => null);
    setLoadingId(null);

    if (!response.ok) {
      setIsPlanLimit(isPlanLimitPayload(payload));
      setMessage(payload?.error ?? "Не удалось создать привычку из шаблона.");
      return;
    }

    const challengeId = payload?.challenge?.id;
    if (challengeId) {
      router.push(`/challenges/${challengeId}`);
    } else {
      router.refresh();
    }
  }

  return (
    <section className="grid gap-4" id="templates">
      <SectionHeader
        description="Готовые привычки с этапами и опытом — запуск в один клик."
        title="Быстрый старт"
      />

      {message ? (
        isPlanLimit ? (
          <PlanLimitAlert message={message} />
        ) : (
          <p className="text-sm text-danger-foreground">{message}</p>
        )
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {visibleTemplates.map((template) => {
          const stageCount = estimateStageCount(template);

          return (
            <Card className="border-border/80" key={template.id} variant="muted">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={template.is_premium ? "gold" : "primary"}>
                  {template.is_premium ? "Премиум" : "Шаблон"}
                </Badge>
                <Badge variant="muted">
                  {DIFFICULTY_LABELS[template.difficulty] ?? template.difficulty}
                </Badge>
              </div>
              <p className="mt-3 font-semibold text-foreground">{template.title}</p>
              {template.description ? (
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {template.description}
                </p>
              ) : null}
              <p className="mt-3 text-xs text-muted-foreground">
                {template.duration_days} дн. · {stageCount} этапов · {template.xp_reward_total} опыта
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Создаст привычку с этапами и начислением опыта.
              </p>
              <Button
                className="mt-4"
                loading={loadingId === template.id}
                onClick={() => startFromTemplate(template)}
                size="sm"
              >
                Начать
              </Button>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
