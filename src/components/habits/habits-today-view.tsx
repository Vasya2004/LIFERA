import Link from "next/link";
import { Flame, Trophy, Zap, CheckCircle2 } from "lucide-react";

import { HabitsDailyChecklist } from "@/components/habits/habits-daily-checklist";
import type {
  HabitChecklistItemData,
  HabitsTodaySummary as TodaySummary,
} from "@/lib/domain/habits-page";

type HabitsTodayViewProps = {
  checklist: HabitChecklistItemData[];
  summary: TodaySummary;
};

function TodayProgressRing({ completed, total }: { completed: number; total: number }) {
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  const size = 56;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const strokeColor = progress === 100 ? "#22c55e" : "#FF5A1F";

  return (
    <div className="relative grid place-items-center">
      <svg aria-hidden="true" className="-rotate-90" height={size} width={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          className="stroke-zinc-100 dark:stroke-zinc-800"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke={strokeColor}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        {progress === 100 ? (
          <CheckCircle2 className="text-green-500" size={20} />
        ) : (
          <span className="text-xs font-bold text-zinc-950 dark:text-zinc-50">{progress}%</span>
        )}
      </div>
    </div>
  );
}

function SummaryStat({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 dark:border-white/5 dark:bg-zinc-950/20">
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
      <div className="mt-1.5 flex items-center gap-2">
        {icon}
        <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">{value}</p>
      </div>
    </div>
  );
}

export function HabitsTodayView({ checklist, summary }: HabitsTodayViewProps) {
  const fullCompletionXp = checklist.reduce(
    (sum, item) => sum + Number(item.habit.xp_reward ?? 0),
    0,
  );
  const hasAny = checklist.length > 0;
  const progress = summary.totalActive > 0 ? Math.round((summary.completedToday / summary.totalActive) * 100) : 0;

  return (
    <>
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
        {hasAny ? (
          <>
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-4">
                <TodayProgressRing completed={summary.completedToday} total={summary.totalActive} />
                <div>
                  <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                    Сегодняшние привычки
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {summary.completedToday} из {summary.totalActive} выполнено · {progress}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <SummaryStat 
                  label="Получено XP" 
                  value={`+${summary.xpToday}`} 
                  icon={<Zap className="text-yellow-500" size={16} />} 
                />
                <SummaryStat 
                  label="Цель XP" 
                  value={`+${fullCompletionXp}`} 
                  icon={<Trophy className="text-[#FF5A1F]" size={16} />} 
                />
                <SummaryStat 
                  label="Лучшая серия" 
                  value={`${summary.bestStreak} дн.`} 
                  icon={<Flame className="text-orange-500" size={16} />} 
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? 'bg-green-500' : 'bg-[#FF5A1F]'}`}
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                На сегодня привычек нет
              </h2>
              <p className="mt-1 max-w-sm text-sm leading-5 text-zinc-500 dark:text-zinc-400">
                Создайте регулярную привычку или настройте расписание, чтобы начать серию.
              </p>
            </div>
            <Link
              className="inline-flex h-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200 px-3.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-zinc-800"
              href="/habits?view=missions"
            >
              Мои привычки
            </Link>
          </div>
        )}
      </section>

      <div className="mt-6">
        <HabitsDailyChecklist items={checklist} />
      </div>
    </>
  );
}
