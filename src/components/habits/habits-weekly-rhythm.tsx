"use client";

import { useMemo, useState } from "react";

import type { HabitRhythmItem } from "@/lib/domain/habits-page";

type HabitsWeeklyRhythmProps = {
  items: HabitRhythmItem[];
};

type ActivityCell = {
  count: number;
  date: string;
};

const monthLabels = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
const dayLabels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function mondayOf(date: Date) {
  const copy = new Date(date);
  const day = copy.getDay() || 7;
  copy.setDate(copy.getDate() - day + 1);
  copy.setHours(12, 0, 0, 0);
  return copy;
}

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function activityClass(count: number) {
  if (count <= 0) return "bg-zinc-200 dark:bg-zinc-800";
  if (count === 1) return "bg-orange-200 dark:bg-orange-950";
  if (count <= 3) return "bg-orange-300 dark:bg-orange-800";
  if (count <= 5) return "bg-orange-400 dark:bg-orange-600";
  return "bg-orange-500";
}

function buildActivity(items: HabitRhythmItem[], weeks: number) {
  const counts = new Map<string, number>();

  for (const item of items) {
    for (const day of item.days) {
      if (day.status === "completed") {
        counts.set(day.date, (counts.get(day.date) ?? 0) + 1);
      }
    }
  }

  const endMonday = mondayOf(new Date());
  const start = addDays(endMonday, -(weeks - 1) * 7);
  const columns: ActivityCell[][] = [];

  for (let week = 0; week < weeks; week += 1) {
    const column: ActivityCell[] = [];
    for (let day = 0; day < 7; day += 1) {
      const date = addDays(start, week * 7 + day);
      const iso = isoDate(date);
      column.push({ count: counts.get(iso) ?? 0, date: iso });
    }
    columns.push(column);
  }

  return columns;
}

export function HabitsWeeklyRhythm({ items }: HabitsWeeklyRhythmProps) {
  const [mode, setMode] = useState<"month" | "year">("year");
  const weeks = mode === "year" ? 52 : 5;
  const columns = useMemo(() => buildActivity(items, weeks), [items, weeks]);
  const totalCompleted = columns.flat().reduce((sum, cell) => sum + cell.count, 0);
  const monthMarkers = columns.map((column, index) => {
    const first = new Date(`${column[0]?.date}T12:00:00`);
    const prev = index > 0 ? new Date(`${columns[index - 1]?.[0]?.date}T12:00:00`) : null;
    const changed = !prev || first.getMonth() !== prev.getMonth();
    return changed ? monthLabels[first.getMonth()] : "";
  });

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Активность</h2>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {totalCompleted} выполнений за последний год
          </p>
        </div>
        <div className="inline-flex rounded-xl border border-zinc-200 bg-zinc-50 p-1 dark:border-white/8 dark:bg-zinc-800/50">
          {(["month", "year"] as const).map((item) => (
            <button
              className={[
                "rounded-lg px-3 py-1.5 text-sm font-semibold transition",
                mode === item
                  ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-700 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
              ].join(" ")}
              key={item}
              onClick={() => setMode(item)}
              type="button"
            >
              {item === "month" ? "Месяц" : "Год"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto pb-1">
        <div className={mode === "year" ? "min-w-[760px]" : "min-w-[360px]"}>
          <div
            className="ml-8 grid gap-[2px]"
            style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}
          >
            {monthMarkers.map((label, index) => (
              <span className="h-5 text-[11px] text-zinc-400 dark:text-zinc-500" key={`${label}-${index}`}>
                {label}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-[28px_minmax(0,1fr)] gap-2">
            <div className="grid gap-[2px]">
              {dayLabels.map((label, index) => (
                <span
                  className={[
                    "grid text-[11px] text-zinc-400 dark:text-zinc-500",
                    mode === "year" ? "h-3 place-items-start" : "h-4 place-items-start",
                  ].join(" ")}
                  key={label}
                >
                  {index % 2 === 0 ? label : ""}
                </span>
              ))}
            </div>
            <div
              className="grid gap-[2px]"
              style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}
            >
              {columns.map((column, weekIndex) => (
                <div className="grid gap-[2px]" key={weekIndex}>
                  {column.map((cell) => (
                    <span
                      aria-label={`${cell.date}: ${cell.count} выполнений`}
                      className={[
                        mode === "year" ? "size-3" : "size-4",
                        "rounded-sm",
                        activityClass(cell.count),
                      ].join(" ")}
                      key={cell.date}
                      title={`${cell.date}: ${cell.count}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end gap-2 text-xs text-zinc-400 dark:text-zinc-500">
        <span>Меньше</span>
        {[0, 1, 3, 5, 6].map((count) => (
          <span className={["size-3 rounded-sm", activityClass(count)].join(" ")} key={count} />
        ))}
        <span>Больше</span>
      </div>
    </section>
  );
}
