"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { STEP_STATUS_LABELS } from "@/lib/domain/labels";
import type { ChallengeStage } from "@/lib/domain/types";

type ChallengeStagesListProps = {
  challengeId: string;
  stages: ChallengeStage[];
};

export function ChallengeStagesList({ challengeId, stages }: ChallengeStagesListProps) {
  const router = useRouter();
  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    tone: "error" | "success";
    text: string;
    showAchievementsLink?: boolean;
  } | null>(null);

  async function completeStage(stageId: string) {
    if (activeStageId) {
      return;
    }

    setActiveStageId(stageId);
    setFeedback(null);

    const response = await fetch(`/api/challenges/${challengeId}/stages/${stageId}/complete`, {
      method: "POST",
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const errorText = payload?.error ?? "Не удалось завершить шаг.";
      const isServiceRoleError =
        response.status === 503 && errorText.includes("SUPABASE_SERVICE_ROLE_KEY");

      setFeedback({
        tone: "error",
        text: isServiceRoleError
          ? "Сервер не настроен для начисления XP. Добавьте SUPABASE_SERVICE_ROLE_KEY в .env.local и перезапустите dev-сервер."
          : errorText,
      });
      setActiveStageId(null);
      return;
    }

    const parts: string[] = [];

    if (payload?.alreadyCompleted) {
      parts.push("Шаг уже был завершён — XP не начислялся повторно.");
    } else {
      parts.push("Шаг завершён.");
      if (payload?.xp?.awarded) {
        parts.push(`+${payload.xp.amount ?? 0} XP. Всего: ${payload.xp.xpTotal}. Уровень: ${payload.xp.level}.`);
      }
      if (payload?.progress != null) {
        parts.push(`Прогресс миссии: ${payload.progress}%.`);
      }
    }

    const unlockedCount = Array.isArray(payload?.achievements) ? payload.achievements.length : 0;
    if (unlockedCount > 0) {
      parts.push(`Открыто достижений: ${unlockedCount}.`);
    }

    setFeedback({ tone: "success", text: parts.join(" "), showAchievementsLink: unlockedCount > 0 });
    setActiveStageId(null);
    router.refresh();
  }

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-xl font-semibold">Шаги миссии</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Завершайте только текущий активный шаг — XP начисляется на сервере один раз.
        </p>
      </div>

      {feedback ? (
        <div
          className={[
            "rounded-[var(--radius-control)] border px-4 py-3 text-sm",
            feedback.tone === "error"
              ? "border-danger/25 bg-danger-subtle text-danger-foreground"
              : "border-[color:var(--border-primary-subtle)] bg-primary-subtle text-foreground",
          ].join(" ")}
        >
          <p>{feedback.text}</p>
          {feedback.tone === "success" && feedback.showAchievementsLink ? (
            <Link className="mt-2 inline-flex font-semibold text-primary hover:underline" href="/achievements">
              Открыть достижения →
            </Link>
          ) : null}
        </div>
      ) : null}

      {stages.map((stage) => {
        const isActive = stage.status === "active";
        const isCompleted = stage.status === "completed";

        return (
          <Card
            className={isActive ? "border-[color:var(--border-primary-strong)]" : ""}
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
                    Шаг {stage.order_index} · {stage.xp_reward} XP
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-foreground">{stage.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {stage.description ?? "Шаг челленджа."}
                </p>
              </div>

              {isActive ? (
                <Button
                  loading={activeStageId === stage.id}
                  onClick={() => completeStage(stage.id)}
                  size="sm"
                >
                  Завершить шаг
                </Button>
              ) : null}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
