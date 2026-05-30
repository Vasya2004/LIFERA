import Link from "next/link";

import { PageTitle } from "@/components/layout/page-title";
import { CreateHabitForm } from "@/components/data/create-habit-form";
import { HabitCard } from "@/components/data/habit-card";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/auth/session";
import type { Habit } from "@/lib/domain/types";

function weekStartDate() {
  const date = new Date();
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  return date.toISOString().slice(0, 10);
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export default async function HabitsPage() {
  const { supabase, user } = await getCurrentUser();
  const weekStart = weekStartDate();
  const today = todayIsoDate();

  const [
    habitsResult,
    goalsResult,
    skillsResult,
    challengesResult,
    logsResult,
  ] =
    supabase && user
      ? await Promise.all([
          supabase
            .from("habits")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
          supabase.from("goals").select("id,title").eq("user_id", user.id),
          supabase.from("skills").select("id,title").eq("user_id", user.id),
          supabase.from("challenges").select("id,title").eq("user_id", user.id),
          supabase
            .from("habit_logs")
            .select("habit_id,completed_on")
            .eq("user_id", user.id)
            .gte("completed_on", weekStart),
        ])
      : [
          { data: [], error: null },
          { data: [], error: null },
          { data: [], error: null },
          { data: [], error: null },
          { data: [], error: null },
        ];

  const allHabits = (habitsResult.data ?? []) as Habit[];
  const activeHabits = allHabits.filter((habit) => habit.status === "active");
  const archivedHabits = allHabits.filter((habit) => habit.status === "archived");
  const goals = goalsResult.data ?? [];
  const skills = skillsResult.data ?? [];
  const challenges = challengesResult.data ?? [];
  const logs = logsResult.data ?? [];
  const pageError =
    habitsResult.error?.message ??
    goalsResult.error?.message ??
    skillsResult.error?.message ??
    challengesResult.error?.message ??
    logsResult.error?.message ??
    null;

  function linkedTitle(items: Array<{ id: string; title: string }>, id: string | null) {
    return items.find((item) => item.id === id)?.title ?? null;
  }

  function weeklyCompletions(habitId: string) {
    return logs.filter((log) => log.habit_id === habitId).length;
  }

  function completedToday(habitId: string) {
    return logs.some((log) => log.habit_id === habitId && log.completed_on === today);
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="grid content-start gap-6">
        <PageTitle subtitle="Ритуалы прокачки." title="Привычки" />

        {pageError ? (
          <Card className="border-danger/25 bg-danger-subtle">
            <h2 className="text-lg font-semibold text-danger-foreground">
              Модуль привычек требует миграцию базы
            </h2>
            <p className="mt-2 text-sm leading-6 text-danger-foreground">
              Примените `supabase/migrations/0002_habits_foundation.sql` и
              `0003_habit_achievements.sql`, затем обновите страницу.
            </p>
          </Card>
        ) : null}

        {!supabase || !user ? (
          <Card variant="muted">
            <p className="text-sm text-muted-foreground">
              Войдите в аккаунт, чтобы управлять ритуалами прокачки.
            </p>
          </Card>
        ) : null}

        {activeHabits.length > 0 ? (
          <div className="grid gap-4">
            <h2 className="text-xl font-semibold">Активные ритуалы</h2>
            {activeHabits.map((habit) => (
              <HabitCard
                challengeTitle={linkedTitle(challenges, habit.linked_challenge_id)}
                completedToday={completedToday(habit.id)}
                goalTitle={linkedTitle(goals, habit.linked_goal_id)}
                habit={habit}
                key={habit.id}
                skillTitle={linkedTitle(skills, habit.linked_skill_id)}
                weekCompletions={weeklyCompletions(habit.id)}
              />
            ))}
          </div>
        ) : pageError ? null : (
          <EmptyState description="Создайте первый ритуал." title="Пока нет активных ритуалов">
            <Link className="text-sm font-semibold text-primary hover:underline" href="#create-habit">
              Создать первую привычку
            </Link>
          </EmptyState>
        )}

        {archivedHabits.length > 0 ? (
          <div className="grid gap-4">
            <h2 className="text-xl font-semibold">Архив</h2>
            {archivedHabits.map((habit) => (
              <Card key={habit.id} variant="muted">
                <p className="font-semibold text-foreground">{habit.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Лучшая серия: {habit.streak_best} · XP за выполнение: {habit.xp_reward}
                </p>
              </Card>
            ))}
          </div>
        ) : null}
      </div>

      <aside className="grid content-start gap-6">
        <Card id="create-habit">
          <h2 className="text-xl font-semibold">Новый ритуал</h2>
          <div className="mt-4">
            <CreateHabitForm challenges={challenges} goals={goals} skills={skills} />
          </div>
        </Card>
      </aside>
    </section>
  );
}
