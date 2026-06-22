"use client";

import { startTransition, useEffect, useState } from "react";

import { HealthEntryButton } from "@/components/health/health-entry-button";
import { STORAGE_KEY } from "@/components/health/health-body-map";
import type { ProblemZone } from "@/components/health/health-body-map";
import { formatDate } from "@/lib/domain/labels";
import type { HealthSnapshot } from "@/lib/domain/health";

type Filter = "all" | "week" | "month" | "zones";

const FILTER_LABELS: Record<Filter, string> = {
  all: "Все",
  week: "Неделя",
  month: "Месяц",
  zones: "С проблемными зонами",
};

function isoToday() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function wellnessLabel(score: number) {
  if (score >= 80) return "Отлично";
  if (score >= 60) return "Хорошо";
  if (score >= 40) return "Средне";
  return "Нужно внимание";
}

function wellnessClass(score: number) {
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 60) return "text-blue-600 dark:text-blue-400";
  if (score >= 40) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

type HealthJournalProps = {
  entries: HealthSnapshot[];
};

export function HealthJournal({ entries }: HealthJournalProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [problemZoneDates, setProblemZoneDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    startTransition(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const zones = JSON.parse(stored) as ProblemZone[];
          setProblemZoneDates(new Set(zones.map((z) => z.updatedAt.slice(0, 10))));
        }
      } catch {
        // ignore
      }
    });
  }, []);

  const today = isoToday();
  const weekAgo = daysAgo(7);
  const monthAgo = daysAgo(30);

  const filtered = entries.filter((entry) => {
    if (filter === "week") return entry.date >= weekAgo && entry.date <= today;
    if (filter === "month") return entry.date >= monthAgo && entry.date <= today;
    if (filter === "zones") return problemZoneDates.has(entry.date.slice(0, 10));
    return true;
  });

  return (
    <div className="grid gap-5">
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {(["all", "week", "month", "zones"] as Filter[]).map((f) => (
          <button
            className={[
              "rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors",
              filter === f
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-white/8 dark:bg-white/4 dark:text-zinc-400 dark:hover:bg-white/8",
            ].join(" ")}
            key={f}
            onClick={() => setFilter(f)}
            type="button"
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Entries */}
      {filtered.length === 0 ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/60 px-4 py-6 text-center dark:border-white/8 dark:bg-white/3">
          <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">Записей нет</p>
          <p className="mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
            {filter === "zones"
              ? "Нет записей в дни с отмеченными зонами."
              : "Добавьте check-in, чтобы Lifera начала отслеживать самочувствие."}
          </p>
          {filter === "all" ? (
            <HealthEntryButton className="mt-4" label="Добавить запись" size="sm" />
          ) : null}
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((entry) => {
            const wellness = Math.round(
              ((entry.energy_level + entry.recovery_score) / 2) * 10
            );
            const hasZoneNote = problemZoneDates.has(entry.date.slice(0, 10));
            return (
              <div
                className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/5 dark:bg-zinc-900/70"
                key={entry.date}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                        {formatDate(entry.date) ?? entry.date}
                      </p>
                      {hasZoneNote ? (
                        <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
                          Зона
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      Энергия {entry.energy_level}/10 · Сон {entry.sleep_hours} ч · Активность{" "}
                      {entry.activity_minutes} мин
                    </p>
                    {entry.note ? (
                      <p className="mt-2 text-sm leading-5 text-zinc-600 dark:text-zinc-400">
                        {entry.note}
                      </p>
                    ) : null}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={["text-base font-bold", wellnessClass(wellness)].join(" ")}>
                      {wellness}
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      {wellnessLabel(wellness)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
