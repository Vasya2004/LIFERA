"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Flame, Search, Target, Trophy, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { HabitChecklistItem } from "@/components/habits/habit-checklist-item";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";
import { showMutationSuccess } from "@/lib/ui/feedback";
import type { HabitChecklistItemData } from "@/lib/domain/habits-page";
import type { Habit, HabitFrequency } from "@/lib/domain/types";

type FilterChip = "all" | "active" | "archive";

type HabitsMissionsViewProps = {
  archivedHabits: Habit[];
  checklist: HabitChecklistItemData[];
  goals: Array<{ id: string; title: string }>;
};

const CHIPS: Array<{ label: string; value: FilterChip }> = [
  { label: "Все", value: "all" },
  { label: "Активные", value: "active" },
  { label: "Архив", value: "archive" },
];

function frequencyLabel(frequency: HabitFrequency): string {
  if (frequency === "daily") return "Каждый день";
  if (frequency === "weekdays") return "По будням";
  if (frequency === "weekly") return "Раз в неделю";
  return "По расписанию";
}

function ArchivedHabitRow({
  habit,
  goalTitle,
  isLast,
}: {
  habit: Habit;
  goalTitle: string | null;
  isLast: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [restoring, setRestoring] = useState(false);

  async function restore() {
    if (restoring) return;
    setRestoring(true);
    const response = await fetch(`/api/habits/${habit.id}`, {
      body: JSON.stringify({ status: "active" }),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    });
    setRestoring(false);
    if (!response.ok) return;
    showMutationSuccess(toast, "Привычка восстановлена");
    router.refresh();
  }

  return (
    <div
      className={[
        "flex items-center gap-3 px-5 py-3.5",
        isLast ? "" : "border-b border-zinc-200 dark:border-white/10",
      ].join(" ")}
    >
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-zinc-100 dark:bg-zinc-800">
        <Trophy aria-hidden="true" className="text-zinc-400 dark:text-zinc-500" size={13} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-950 dark:text-zinc-50">{habit.title}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2.5 text-xs text-zinc-500 dark:text-zinc-400">
          <span>{frequencyLabel(habit.frequency)}</span>
          {goalTitle ? (
            <>
              <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">·</span>
              <span className="truncate">{goalTitle}</span>
            </>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
        {habit.streak_best > 0 ? (
          <span className="inline-flex items-center gap-1">
            <Flame aria-hidden="true" className="text-primary/50" size={11} />
            {habit.streak_best} дн.
          </span>
        ) : null}
        <span className="font-semibold">+{habit.xp_reward} XP</span>
        <Button
          className="h-7 gap-1 px-2 text-xs"
          loading={restoring}
          onClick={restore}
          size="sm"
          variant="secondary"
        >
          <Undo2 size={12} />
          Восстановить
        </Button>
      </div>
    </div>
  );
}

export function HabitsMissionsView({ archivedHabits, checklist, goals }: HabitsMissionsViewProps) {
  const [filter, setFilter] = useState<FilterChip>("all");
  const [search, setSearch] = useState("");

  function goalTitle(habit: Habit) {
    return goals.find((g) => g.id === habit.linked_goal_id)?.title ?? null;
  }

  const chipCount = (chip: FilterChip) => {
    if (chip === "all") return checklist.length + archivedHabits.length;
    if (chip === "active") return checklist.length;
    return archivedHabits.length;
  };

  const hasAny = checklist.length > 0 || archivedHabits.length > 0;

  const query = search.trim().toLowerCase();

  const filteredActive = useMemo(
    () => (query ? checklist.filter((item) => item.habit.title.toLowerCase().includes(query)) : checklist),
    [checklist, query],
  );

  const filteredArchived = useMemo(
    () => (query ? archivedHabits.filter((h) => h.title.toLowerCase().includes(query)) : archivedHabits),
    [archivedHabits, query],
  );

  const showActiveList = (filter === "all" || filter === "active") && filteredActive.length > 0;
  const showArchiveList = (filter === "all" || filter === "archive") && filteredArchived.length > 0;

  const noItemsForFilter =
    (filter === "active" && filteredActive.length === 0) ||
    (filter === "archive" && filteredArchived.length === 0);

  const noResultsForSearch = query && !showActiveList && !showArchiveList;

  if (!hasAny) {
    return (
      <section className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-white/10 dark:bg-zinc-900">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-zinc-200 bg-zinc-50 text-primary dark:border-white/10 dark:bg-zinc-800">
          <Target aria-hidden="true" size={22} />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          Привычки пока не созданы
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          Создайте первую регулярную привычку и свяжите её с целью, чтобы начать получать XP и строить серию.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/goals">
            <Button variant="secondary">Открыть цели</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Фильтр привычек">
          {CHIPS.map((chip) => {
            const isActive = filter === chip.value;
            const count = chipCount(chip.value);
            return (
              <button
                aria-pressed={isActive ? "true" : "false"}
                className={[
                  "inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-white/5",
                ].join(" ")}
                key={chip.value}
                onClick={() => setFilter(chip.value)}
                type="button"
              >
                {chip.label}
                <span
                  className={[
                    "min-w-[16px] text-center text-xs",
                    isActive ? "text-primary/70" : "text-zinc-400 dark:text-zinc-500",
                  ].join(" ")}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={15} />
          <input
            className="h-9 w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-950 placeholder:text-zinc-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 sm:w-56 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск привычки..."
            type="search"
            value={search}
          />
        </div>
      </div>

      {noItemsForFilter || noResultsForSearch ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-white/10 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {noResultsForSearch
              ? "Ничего не найдено"
              : filter === "archive"
                ? "В архиве пока нет привычек"
                : "Нет активных привычек"}
          </p>
          {noResultsForSearch ? (
            <button
              className="mt-3 text-sm font-semibold text-primary hover:underline"
              onClick={() => { setSearch(""); setFilter("all"); }}
              type="button"
            >
              Сбросить поиск
            </button>
          ) : filter === "archive" ? (
            <button
              className="mt-3 text-sm font-semibold text-primary hover:underline"
              onClick={() => setFilter("all")}
              type="button"
            >
              Показать все
            </button>
          ) : null}
        </div>
      ) : (
        <div className="grid gap-3">
          {showActiveList ? (
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900">
              <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-5 py-3 dark:border-white/10">
                <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  Активные привычки
                </h2>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-500 dark:bg-white/8 dark:text-zinc-400">
                  {filteredActive.length}
                </span>
              </div>
              {filteredActive.map((item, index) => (
                <HabitChecklistItem
                  isLast={index === filteredActive.length - 1}
                  key={item.habit.id}
                  {...item}
                />
              ))}
            </div>
          ) : null}

          {showArchiveList ? (
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900">
              <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-5 py-3 dark:border-white/10">
                <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Архив</h2>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-400 dark:bg-white/8 dark:text-zinc-500">
                  {filteredArchived.length}
                </span>
              </div>
              {filteredArchived.map((habit, index) => (
                <ArchivedHabitRow
                  goalTitle={goalTitle(habit)}
                  habit={habit}
                  isLast={index === filteredArchived.length - 1}
                  key={habit.id}
                />
              ))}
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
