import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { WEEKDAY_LABELS, computeStreak, toISODate } from "@/lib/doit-dates";
import type {
  CreatorHabit,
  CreatorHabitLog,
  DailyHabit,
  DailyHabitLog,
} from "@/lib/doit/database.types";

const CATEGORY_LABELS: Record<string, string> = {
  ideas: "Идеи",
  writing: "Написание",
  publishing: "Публикация",
  promotion: "Продвижение",
  analytics: "Аналитика",
};

export default function DashboardView({
  dailyHabits,
  dailyLogs,
  creatorHabits,
  creatorLogs,
  today,
  weekStart,
}: {
  dailyHabits: DailyHabit[];
  dailyLogs: DailyHabitLog[];
  creatorHabits: CreatorHabit[];
  creatorLogs: CreatorHabitLog[];
  today: string;
  weekStart: string;
}) {
  const todayWeekday = new Date().getDay();
  const scheduledToday = dailyHabits.filter((h) =>
    h.weekdays.includes(todayWeekday)
  );
  const doneTodayIds = new Set(
    dailyLogs.filter((l) => l.log_date === today).map((l) => l.habit_id)
  );
  const doneTodayCount = scheduledToday.filter((h) =>
    doneTodayIds.has(h.id)
  ).length;

  const logsByHabit = new Map<string, Set<string>>();
  for (const log of dailyLogs) {
    if (!logsByHabit.has(log.habit_id)) logsByHabit.set(log.habit_id, new Set());
    logsByHabit.get(log.habit_id)!.add(log.log_date);
  }

  const habitsWithStreak = dailyHabits.map((h) => ({
    habit: h,
    streak: computeStreak(logsByHabit.get(h.id) ?? new Set()),
    doneToday: doneTodayIds.has(h.id),
    scheduledToday: h.weekdays.includes(todayWeekday),
  }));

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const creatorLogsThisWeek = creatorLogs.filter(
    (l) => l.week_start === weekStart
  );
  const countByHabit = new Map<string, number>();
  for (const log of creatorLogsThisWeek) {
    countByHabit.set(
      log.habit_id,
      (countByHabit.get(log.habit_id) ?? 0) + log.completed_count
    );
  }
  const totalThisWeek = creatorLogsThisWeek.reduce(
    (sum, l) => sum + l.completed_count,
    0
  );

  const totalByCategory = new Map<string, number>();
  for (const habit of creatorHabits) {
    const count = countByHabit.get(habit.id) ?? 0;
    const key = habit.category ?? "other";
    totalByCategory.set(key, (totalByCategory.get(key) ?? 0) + count);
  }

  const allTimeByHabit = new Map<string, number>();
  for (const log of creatorLogs) {
    allTimeByHabit.set(
      log.habit_id,
      (allTimeByHabit.get(log.habit_id) ?? 0) + log.completed_count
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Дашборд</h1>
        <p className="text-sm text-muted mt-0.5">Сводка по всем привычкам</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <p className="text-xs text-muted">Сегодня выполнено</p>
          <p className="text-3xl font-semibold mt-1 tracking-tight">
            {doneTodayCount}
            <span className="text-lg text-muted">/{scheduledToday.length}</span>
          </p>
          <Link
            href="/daily"
            className="text-xs text-accent hover:underline mt-2 inline-block"
          >
            Открыть привычки →
          </Link>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">Креатор-действий на неделе</p>
          <p className="text-3xl font-semibold mt-1 tracking-tight">
            {totalThisWeek}
          </p>
          <Link
            href="/creator"
            className="text-xs text-accent hover:underline mt-2 inline-block"
          >
            Открыть креатор-привычки →
          </Link>
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="text-sm font-medium mb-3">Привычки на день — стрики</h2>
        {habitsWithStreak.length === 0 ? (
          <p className="text-sm text-muted py-4 text-center">Нет привычек</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {habitsWithStreak.map(({ habit, streak, doneToday, scheduledToday }) => (
              <li key={habit.id} className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: habit.color || "var(--accent)" }}
                />
                <span className="flex-1 text-sm truncate">{habit.title}</span>
                {scheduledToday && (
                  <span
                    className={`text-xs rounded-full px-2 py-0.5 ${
                      doneToday
                        ? "bg-success/10 text-success"
                        : "bg-border text-muted"
                    }`}
                  >
                    {doneToday ? "сделано" : "сегодня"}
                  </span>
                )}
                <span className="flex items-center gap-1 text-sm font-medium text-accent shrink-0">
                  🔥 {streak}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted mb-2">Последние 7 дней</p>
          <div className="flex gap-1.5">
            {last7Days.map((d) => {
              const iso = toISODate(d);
              const doneCount = dailyHabits.filter((h) =>
                logsByHabit.get(h.id)?.has(iso)
              ).length;
              const scheduledCount = dailyHabits.filter((h) =>
                h.weekdays.includes(d.getDay())
              ).length;
              const ratio = scheduledCount === 0 ? 0 : doneCount / scheduledCount;
              return (
                <div key={iso} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full h-8 rounded-md"
                    style={{
                      backgroundColor:
                        ratio === 0
                          ? "var(--border)"
                          : `color-mix(in srgb, var(--accent) ${Math.round(
                              ratio * 100
                            )}%, var(--border))`,
                    }}
                    title={`${doneCount}/${scheduledCount}`}
                  />
                  <span className="text-[10px] text-muted">
                    {WEEKDAY_LABELS[d.getDay()]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="text-sm font-medium mb-3">Креатор-привычки — эта неделя</h2>
        {creatorHabits.length === 0 ? (
          <p className="text-sm text-muted py-4 text-center">Нет привычек</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {creatorHabits.map((habit) => {
              const count = countByHabit.get(habit.id) ?? 0;
              const allTime = allTimeByHabit.get(habit.id) ?? 0;
              return (
                <li key={habit.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: habit.color || "var(--accent)" }}
                      />
                      <span className="text-sm truncate">{habit.title}</span>
                    </div>
                    <span className="text-xs text-muted shrink-0">
                      всего: {allTime}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full bg-accent"
                      style={{
                        width: `${Math.min(
                          100,
                          (count / habit.weekly_target) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {totalByCategory.size > 0 && (
          <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2">
            {Array.from(totalByCategory.entries()).map(([category, count]) => (
              <span
                key={category}
                className="text-xs rounded-full bg-accent-soft text-accent px-2.5 py-1"
              >
                {CATEGORY_LABELS[category] ?? category}: {count}
              </span>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
