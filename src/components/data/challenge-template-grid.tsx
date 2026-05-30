"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlanLimitAlert } from "@/components/ui/plan-limit-alert";
import { isPlanLimitPayload } from "@/lib/api/plan-limit";
import { DIFFICULTY_LABELS } from "@/lib/domain/labels";
import type { Challenge } from "@/lib/domain/types";

type ChallengeTemplateGridProps = {
  goals: Array<{ id: string; title: string }>;
  templates: Challenge[];
};

export function ChallengeTemplateGrid({ goals, templates }: ChallengeTemplateGridProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPlanLimit, setIsPlanLimit] = useState(false);

  async function createFromTemplate(template: Challenge) {
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
      setMessage(payload?.error ?? "Не удалось создать челлендж из шаблона.");
      return;
    }

    const challengeId = payload?.challenge?.id;
    if (challengeId) {
      router.push(`/challenges/${challengeId}`);
    } else {
      router.refresh();
    }
  }

  if (templates.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-xl font-semibold">Каталог шаблонов</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Готовые миссии с преднастроенными шагами и XP.
        </p>
      </div>
      {message ? (
        isPlanLimit ? (
          <PlanLimitAlert message={message} />
        ) : (
          <p className="text-sm text-danger-foreground">{message}</p>
        )
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((template) => (
          <Card key={template.id} variant="muted">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={template.is_premium ? "gold" : "primary"}>
                {template.is_premium ? "Premium" : "Шаблон"}
              </Badge>
              <Badge variant="muted">{DIFFICULTY_LABELS[template.difficulty] ?? template.difficulty}</Badge>
            </div>
            <p className="mt-3 font-semibold text-foreground">{template.title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {template.description}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              {template.duration_days} дн. · {template.xp_reward_total} XP
            </p>
            <Button
              className="mt-4"
              loading={loadingId === template.id}
              onClick={() => createFromTemplate(template)}
              size="sm"
            >
              Использовать шаблон
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
