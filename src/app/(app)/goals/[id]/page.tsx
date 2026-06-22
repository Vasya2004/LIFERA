import Link from "next/link";
import { notFound } from "next/navigation";
import { ChallengeStagesList } from "@/components/data/challenge-stages-list";
import { GoalDetailEditButton } from "@/components/goals/goal-detail-edit-button";
import { HabitCompleteButton } from "@/components/habits/habit-complete-button";
import { PageContent } from "@/components/layout/page-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getCurrentUser } from "@/lib/auth/session";
import { getGoalDetailData, type GoalDetailChallenge } from "@/lib/domain/goal-detail";
import {
  CHALLENGE_STATUS_LABELS,
  DIFFICULTY_LABELS,
  formatDate,
  formatGoalStatus,
  formatLifeArea,
} from "@/lib/domain/labels";

type GoalDetailPageProps = {
  params: Promise<{ id: string }>;
};

function goalDeadlineText(targetDate: string | null) {
  const formatted = formatDate(targetDate);
  return formatted ? `до ${formatted}` : "срок не задан";
}

function PlanCard({ challenge }: { challenge: GoalDetailChallenge }) {
  const progress = Number(challenge.progress);

  return (
    <Card className="grid gap-4" variant={challenge.status === "active" ? "elevated" : "default"}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <Badge variant={challenge.status === "active" ? "primary" : "muted"}>
              {CHALLENGE_STATUS_LABELS[challenge.status] ?? challenge.status}
            </Badge>
            <Badge variant="muted">
              {DIFFICULTY_LABELS[challenge.difficulty] ?? challenge.difficulty}
            </Badge>
          </div>
          <h3 className="mt-3 text-lg font-semibold text-foreground">{challenge.title}</h3>
          {challenge.description ? (
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {challenge.description}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">Прогресс плана</span>
          <span className="font-semibold text-foreground">{progress}%</span>
        </div>
        <Progress className="mt-2" tone="primary" value={progress} />
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          {challenge.completedStagesCount} из {challenge.totalStagesCount} этапов ·{" "}
          {challenge.xp_reward_total} опыта
        </p>
      </div>

      {challenge.nextStage ? (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Следующий этап:</span>{" "}
          {challenge.nextStage.title}
        </p>
      ) : null}
    </Card>
  );
}

export default async function GoalDetailPage({ params }: GoalDetailPageProps) {
  const { id } = await params;
  const { supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    notFound();
  }

  const data = await getGoalDetailData(supabase, user.id, id);

  if (!data.goal) {
    notFound();
  }

  const goal = data.goal;
  const progress = Number(goal.progress);
  const activeRituals = data.habits.filter((item) => item.habit.status === "active");
  const isPrimaryGoal = data.profilePrimaryGoalId === goal.id;

  return (
    <PageContent>
      <div className="grid gap-2" id="overview">
        <Link className="text-sm font-semibold text-primary" href="/goals">
          Все цели
        </Link>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Рабочее пространство цели
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <h1 className="min-w-0 break-words text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {goal.title}
              </h1>
              <GoalDetailEditButton
                goal={goal}
                isPrimary={isPrimaryGoal}
                linkedWishId={data.wish?.id ?? null}
                wishes={data.wishes}
              />
            </div>
            <p className="mt-3 max-w-3xl break-words text-sm leading-6 text-muted-foreground sm:text-base">
              {goal.description ??
                "Цель становится рабочей системой, когда у неё есть план, привычки и понятный следующий шаг."}
            </p>
          </div>
          <Card className="lg:sticky lg:top-[calc(var(--topbar-height)+1rem)]" variant="highlight">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Следующий лучший шаг
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">
              {data.recommendation.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {data.recommendation.reason}
            </p>
            <Link className="mt-4 inline-flex w-full" href={data.recommendation.ctaHref}>
              <Button className="w-full" size="sm">
                {data.recommendation.ctaLabel}
              </Button>
            </Link>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <p className="text-sm text-muted-foreground">Статус</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {formatGoalStatus(goal.status)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Сфера</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {formatLifeArea(goal.life_area)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">План цели</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {data.activeChallenge ? "Собран" : "Нужен"}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Привычки</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{activeRituals.length}</p>
        </Card>
      </div>

      <Card id="progress">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">{formatLifeArea(goal.life_area)}</Badge>
              <Badge variant="muted">{goalDeadlineText(goal.target_date)}</Badge>
              {data.skill ? <Badge variant="muted">{data.skill.title}</Badge> : null}
            </div>
            <h2 className="mt-4 text-xl font-semibold text-foreground">Прогресс цели</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Прогресс обновляется через этапы плана цели и регулярные привычки. Это не список
              задач, а траектория закрытия результата.
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-3xl font-semibold text-foreground">{progress}%</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {data.completedStagesCount} из {data.totalStagesCount} этапов завершено
            </p>
          </div>
        </div>
        <Progress className="mt-5" label="Прогресс цели" tone="primary" value={progress} />
      </Card>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] xl:gap-6">
        <div className="grid min-w-0 content-start gap-5 xl:gap-6">
          <section className="grid gap-4" id="goal-plan">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">План цели</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Привычки остаются внутренним планом: этапы, прогресс и опыт.
                </p>
              </div>
            </div>

            {data.activeChallenge ? <PlanCard challenge={data.activeChallenge} /> : null}

            {data.activeChallenge?.stages.length ? (
              <ChallengeStagesList
                challengeId={data.activeChallenge.id}
                stages={data.activeChallenge.stages}
              />
            ) : (
              <Card variant="muted">
                <p className="text-sm leading-6 text-muted-foreground">
                  У этой цели пока нет активной привычки с этапами. Создайте план цели, чтобы
                  превратить результат в последовательность действий с опытом.
                </p>
              </Card>
            )}
          </section>
        </div>

        <aside className="grid min-w-0 content-start gap-5 xl:gap-6">
          <Card id="rituals">
            <CardHeader>
              <CardTitle>Привычки цели</CardTitle>
              <CardDescription>
                Регулярные действия, которые поддерживают движение между этапами плана.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {activeRituals.length > 0 ? (
                activeRituals.map(({ completedToday, habit }) => (
                  <div
                    className="rounded-[var(--radius-control)] border border-border bg-surface-muted px-4 py-3"
                    key={habit.id}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">{habit.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Серия {habit.streak_current} дн. · +{habit.xp_reward} опыта
                        </p>
                      </div>
                      <HabitCompleteButton
                        habitId={habit.id}
                        initialCompleted={completedToday}
                        label="Отметить"
                        size="sm"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[var(--radius-control)] border border-border bg-surface-muted px-4 py-3">
                  <p className="text-sm leading-6 text-muted-foreground">
                    Связанных привычек пока нет. Добавьте привычку в разделе «Привычки».
                  </p>
                </div>
              )}
              <Link href="/habits">
                <Button className="w-full" size="sm" variant="secondary">
                  Открыть привычки
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card id="wish">
            <CardHeader>
              <CardTitle>Желание / мотивация</CardTitle>
              <CardDescription>Ответ на вопрос: зачем закрывать эту цель?</CardDescription>
            </CardHeader>
            <CardContent>
              {data.wish ? (
                <div className="rounded-[var(--radius-control)] border border-border bg-surface-muted px-4 py-3">
                  <p className="font-medium text-foreground">{data.wish.title}</p>
                  {data.wish.description ? (
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {data.wish.description}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm leading-6 text-muted-foreground">
                  Связанного желания пока нет. Добавьте его в карте желаний, чтобы закрепить
                  мотивацию цели.
                </p>
              )}
              <Link className="mt-4 inline-flex w-full" href="/goals/wishes">
                <Button className="w-full" size="sm" variant="secondary">
                  Открыть карту желаний
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card id="assistant">
            <CardHeader>
              <CardTitle>Рекомендация Lifera</CardTitle>
              <CardDescription>{data.recommendation.reason}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link className="inline-flex w-full" href={data.recommendation.ctaHref}>
                <Button className="w-full" size="sm">
                  {data.recommendation.ctaLabel}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </aside>
      </div>
    </PageContent>
  );
}
