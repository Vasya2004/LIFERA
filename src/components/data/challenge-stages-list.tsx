"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast-provider";
import { STEP_STATUS_LABELS } from "@/lib/domain/labels";
import type { ChallengeStage } from "@/lib/domain/types";
import {
  maybeShowLevelUpToast,
  showAchievementUnlockedToasts,
} from "@/lib/ui/feedback";

type ChallengeStagesListProps = {
  challengeId: string;
  stages: ChallengeStage[];
};

export function ChallengeStagesList({ challengeId, stages }: ChallengeStagesListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeStageId, setActiveStageId] = useState<string | null>(null);

  async function completeStage(stageId: string) {
    if (activeStageId) {
      return;
    }

    setActiveStageId(stageId);

    const response = await fetch(`/api/challenges/${challengeId}/stages/${stageId}/complete`, {
      method: "POST",
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const errorText = payload?.error ?? "Не удалось завершить этап.";
      const isServiceRoleError =
        response.status === 503 && errorText.includes("SUPABASE_SERVICE_ROLE_KEY");

      toast({
        description: isServiceRoleError
          ? errorText
          : "Попробуйте ещё раз.",
        title: "Не удалось завершить этап",
        variant: "error",
      });
      setActiveStageId(null);
      return;
    }

    if (payload?.alreadyCompleted) {
      toast({
        description: "Повторный опыт не начисляется.",
        title: "Этап уже завершён",
        variant: "info",
      });
    } else {
      const xp = Number(payload?.xp?.amount ?? 0);
      const progress =
        payload?.progress != null ? ` · Прогресс привычки ${payload.progress}%` : "";

      toast({
        description: xp > 0 ? `+${xp} опыта · Привычка продвинулась${progress}` : `Привычка продвинулась${progress}`,
        title: "Этап завершён",
        variant: "progress",
      });

      maybeShowLevelUpToast(toast, payload?.xp);
      showAchievementUnlockedToasts(toast, payload?.achievements);
    }

    setActiveStageId(null);
    router.refresh();
  }

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-xl font-semibold">Этапы привычки</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Завершайте только текущий активный этап — опыт начисляется на сервере один раз.
        </p>
      </div>

      {stages.map((stage) => {
        const isActive = stage.status === "active";
        const isCompleted = stage.status === "completed";

        return (
          <Card
            className={[
              "motion-lift",
              isActive ? "border-[color:var(--border-primary-strong)]" : "",
              isCompleted ? "opacity-95" : "",
            ].join(" ")}
            key={stage.id}
            variant={isActive ? "elevated" : "default"}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={isCompleted ? "success" : isActive ? "primary" : "muted"}>
                    {STEP_STATUS_LABELS[stage.status] ?? stage.status}
                  </Badge>
                  <span className="text-xs font-medium text-muted-foreground">
                    Этап {stage.order_index} · {stage.xp_reward} опыта
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-foreground">{stage.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {stage.description ?? "Этап привычки."}
                </p>
              </div>

              {isActive ? (
                <Button
                  loading={activeStageId === stage.id}
                  loadingLabel="Завершаем..."
                  onClick={() => completeStage(stage.id)}
                  size="sm"
                >
                  Завершить этап
                </Button>
              ) : null}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
