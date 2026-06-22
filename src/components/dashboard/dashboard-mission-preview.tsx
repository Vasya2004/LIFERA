import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { DashboardMissionStages } from "@/lib/domain/dashboard";
import type { Challenge, ChallengeStage, Goal } from "@/lib/domain/types";

type DashboardMissionPreviewProps = {
  challenge: Challenge | null;
  goal: Goal | null;
  missionStages: DashboardMissionStages;
  nextStage: ChallengeStage | null;
};

export function DashboardMissionPreview({
  challenge,
  goal,
  missionStages,
  nextStage,
}: DashboardMissionPreviewProps) {
  return (
    <Card
      className={challenge ? "grid gap-4 border-[color:var(--border-primary-subtle)]/60" : "grid gap-4"}
    >
      <h2 className="text-xl font-semibold tracking-tight">Активная привычка</h2>

      {challenge ? (
        <>
          <div>
            <p className="text-lg font-semibold text-foreground">{challenge.title}</p>
            {goal ? (
              <p className="mt-1 text-sm text-muted-foreground">
                Цель: <span className="font-medium text-foreground">{goal.title}</span>
              </p>
            ) : null}
          </div>

          {missionStages.total > 0 ? (
            <p className="text-sm text-muted-foreground">
              {missionStages.completed} из {missionStages.total} этапов
              {nextStage ? ` · +${Number(nextStage.xp_reward ?? 0)} опыта за этап` : null}
            </p>
          ) : null}

          <Progress label="Прогресс" tone="primary" value={Number(challenge.progress)} />

          {nextStage ? (
            <p className="text-sm text-muted-foreground">
              Следующий этап:{" "}
              <span className="font-medium text-foreground">{nextStage.title}</span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Все этапы завершены — проверьте статус привычки.</p>
          )}

        </>
      ) : (
        <div className="rounded-[var(--radius-control)] border border-dashed border-border bg-surface-muted px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Добавьте регулярную привычку, чтобы поддержать движение к цели.
          </p>
        </div>
      )}
    </Card>
  );
}
