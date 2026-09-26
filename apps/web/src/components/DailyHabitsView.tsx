"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { WEEKDAY_LABELS } from "@/lib/doit-dates";
import { Card } from "@/components/ui/Card";
import { ColorPicker, HABIT_COLORS } from "@/components/ui/ColorPicker";
import type { DailyHabit, DailyHabitLog } from "@/lib/doit/database.types";

export default function DailyHabitsView({
  initialHabits,
  initialLogs,
  today,
}: {
  initialHabits: DailyHabit[];
  initialLogs: DailyHabitLog[];
  today: string;
}) {
  const supabase = createClient();
  const [habits, setHabits] = useState(initialHabits);
  const [logs, setLogs] = useState(initialLogs);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState(HABIT_COLORS[0]);
  const [submitting, setSubmitting] = useState(false);

  const todaysWeekday = new Date().getDay();
  const doneIds = new Set(logs.map((l) => l.habit_id));

  async function toggleHabit(habit: DailyHabit) {
    const isDone = doneIds.has(habit.id);

    if (isDone) {
      const log = logs.find((l) => l.habit_id === habit.id);
      if (!log) return;
      setLogs(logs.filter((l) => l.id !== log.id));
      await supabase.from("daily_habit_logs").delete().eq("id", log.id);
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const optimistic: DailyHabitLog = {
        id: crypto.randomUUID(),
        habit_id: habit.id,
        user_id: user.id,
        log_date: today,
        completed_at: new Date().toISOString(),
        note: null,
      };
      setLogs([...logs, optimistic]);

      const { data } = await supabase
        .from("daily_habit_logs")
        .insert({ habit_id: habit.id, user_id: user.id, log_date: today })
        .select()
        .single();

      if (data) {
        setLogs((prev) =>
          prev.map((l) => (l.id === optimistic.id ? data : l))
        );
      }
    }
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
      .from("daily_habits")
      .insert({
        title: title.trim(),
        icon: icon.trim() || null,
        color,
        user_id: user.id,
      })
      .select()
      .single();

    setSubmitting(false);

    if (!error && data) {
      setHabits([...habits, data]);
      setTitle("");
      setIcon("");
      setColor(HABIT_COLORS[0]);
      setShowForm(false);
    }
  }

  async function removeHabit(id: string) {
    setHabits(habits.filter((h) => h.id !== id));
    await supabase.from("daily_habits").update({ is_archived: true }).eq("id", id);
  }

  const visibleHabits = habits.filter((h) =>
    h.weekdays.includes(todaysWeekday)
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Сегодня</h1>
        <span className="text-sm text-muted rounded-full bg-accent-soft text-accent px-2.5 py-1">
          {WEEKDAY_LABELS[todaysWeekday]}
        </span>
      </div>

      <ul className="flex flex-col gap-2.5">
        {visibleHabits.length === 0 && (
          <li className="text-sm text-muted py-10 text-center">
            Пока нет привычек на сегодня. Добавьте первую.
          </li>
        )}
        {visibleHabits.map((habit) => {
          const done = doneIds.has(habit.id);
          return (
            <Card
              key={habit.id}
              className="flex items-center gap-3 px-4 py-3 group"
            >
              <button
                onClick={() => toggleHabit(habit)}
                className="h-7 w-7 shrink-0 rounded-full border-2 flex items-center justify-center transition-all"
                style={{
                  borderColor: habit.color || "var(--accent)",
                  backgroundColor: done ? habit.color || "var(--accent)" : "transparent",
                }}
                aria-label="toggle"
              >
                {done && <span className="text-white text-xs">✓</span>}
              </button>
              {habit.icon && <span className="text-lg leading-none">{habit.icon}</span>}
              <span
                className={`flex-1 text-sm ${
                  done ? "line-through text-muted" : ""
                }`}
              >
                {habit.title}
              </span>
              <button
                onClick={() => removeHabit(habit.id)}
                className="text-xs text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
              >
                удалить
              </button>
            </Card>
          );
        })}
      </ul>

      {showForm ? (
        <Card className="p-4">
          <form onSubmit={addHabit} className="flex flex-col gap-3">
            <div className="flex gap-2">
              <input
                autoFocus
                value={icon}
                onChange={(e) => setIcon(e.target.value.slice(0, 2))}
                placeholder="🙂"
                className="w-14 text-center rounded-lg border border-border bg-transparent px-2 py-2 text-lg outline-none focus:border-accent"
              />
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Название привычки"
                className="flex-1 rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
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
          + Добавить привычку
        </button>
      )}
    </div>
  );
}
