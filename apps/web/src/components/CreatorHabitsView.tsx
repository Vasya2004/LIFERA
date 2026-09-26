"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { ColorPicker, HABIT_COLORS } from "@/components/ui/ColorPicker";
import type { CreatorHabit, CreatorHabitLog } from "@/lib/doit/database.types";

const CATEGORIES = [
  { value: "ideas", label: "Идеи" },
  { value: "writing", label: "Написание" },
  { value: "publishing", label: "Публикация" },
  { value: "promotion", label: "Продвижение" },
  { value: "analytics", label: "Аналитика" },
];

export default function CreatorHabitsView({
  initialHabits,
  initialLogs,
  weekStart,
}: {
  initialHabits: CreatorHabit[];
  initialLogs: CreatorHabitLog[];
  weekStart: string;
}) {
  const supabase = createClient();
  const [habits, setHabits] = useState(initialHabits);
  const [logs, setLogs] = useState(initialLogs);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [weeklyTarget, setWeeklyTarget] = useState(3);
  const [color, setColor] = useState(HABIT_COLORS[1]);
  const [submitting, setSubmitting] = useState(false);

  function completedCountFor(habitId: string) {
    return logs
      .filter((l) => l.habit_id === habitId)
      .reduce((sum, l) => sum + l.completed_count, 0);
  }

  async function logProgress(habit: CreatorHabit) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const optimistic: CreatorHabitLog = {
      id: crypto.randomUUID(),
      habit_id: habit.id,
      user_id: user.id,
      week_start: weekStart,
      completed_count: 1,
      note: null,
      created_at: new Date().toISOString(),
    };
    setLogs([...logs, optimistic]);

    const { data } = await supabase
      .from("creator_habit_logs")
      .insert({ habit_id: habit.id, user_id: user.id, week_start: weekStart })
      .select()
      .single();

    if (data) {
      setLogs((prev) =>
        prev.map((l) => (l.id === optimistic.id ? data : l))
      );
    }
  }

  async function undoLast(habit: CreatorHabit) {
    const habitLogs = logs
      .filter((l) => l.habit_id === habit.id)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
    const last = habitLogs[0];
    if (!last) return;

    setLogs(logs.filter((l) => l.id !== last.id));
    await supabase.from("creator_habit_logs").delete().eq("id", last.id);
  }

  async function addHabit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSubmitting(false);
      return;
    }

    const { data, error } = await supabase
      .from("creator_habits")
      .insert({
        title: title.trim(),
        category,
        weekly_target: weeklyTarget,
        color,
        user_id: user.id,
      })
      .select()
      .single();

    setSubmitting(false);

    if (!error && data) {
      setHabits([...habits, data]);
      setTitle("");
      setColor(HABIT_COLORS[1]);
      setShowForm(false);
    }
  }

  async function removeHabit(id: string) {
    setHabits(habits.filter((h) => h.id !== id));
    await supabase
      .from("creator_habits")
      .update({ is_archived: true })
      .eq("id", id);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Эта неделя</h1>
        <span className="text-sm text-muted">c {weekStart}</span>
      </div>

      <ul className="flex flex-col gap-2.5">
        {habits.length === 0 && (
          <li className="text-sm text-muted py-10 text-center">
            Пока нет креатор-привычек для развития блога. Добавьте первую.
          </li>
        )}
        {habits.map((habit) => {
          const count = completedCountFor(habit.id);
          const done = count >= habit.weekly_target;
          const categoryLabel = CATEGORIES.find(
            (c) => c.value === habit.category
          )?.label;
          const habitColor = habit.color || "var(--accent)";

          return (
            <Card key={habit.id} className="flex flex-col gap-2.5 px-4 py-3 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: habitColor }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{habit.title}</p>
                    {categoryLabel && (
                      <span className="text-xs text-muted">{categoryLabel}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeHabit(habit.id)}
                  className="text-xs text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                >
                  удалить
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{
                      backgroundColor: done ? "var(--success)" : habitColor,
                      width: `${Math.min(
                        100,
                        (count / habit.weekly_target) * 100
                      )}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-muted shrink-0">
                  {count}/{habit.weekly_target}
                </span>
                <button
                  onClick={() => undoLast(habit)}
                  disabled={count === 0}
                  className="text-muted hover:text-foreground disabled:opacity-30 transition-colors"
                >
                  <MinusIcon />
                </button>
                <button
                  onClick={() => logProgress(habit)}
                  className="rounded-full h-6 w-6 flex items-center justify-center text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: habitColor }}
                >
                  <PlusIcon />
                </button>
              </div>
            </Card>
          );
        })}
      </ul>

      {showForm ? (
        <Card className="p-4">
          <form onSubmit={addHabit} className="flex flex-col gap-3">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название привычки (напр. «Написать пост»)"
              className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <div className="flex gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex-1 rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                max={21}
                value={weeklyTarget}
                onChange={(e) => setWeeklyTarget(Number(e.target.value))}
                className="w-20 rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
            <ColorPicker value={color} onChange={setColor} />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-accent text-accent-foreground px-4 py-2 text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                Добавить
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
              >
                Отмена
              </button>
            </div>
          </form>
        </Card>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="self-start text-sm text-accent hover:opacity-80 transition-opacity"
        >
          + Добавить креатор-привычку
        </button>
      )}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M5 12h14" />
    </svg>
  );
}
