"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatLifeArea } from "@/lib/domain/labels";
import type { Habit } from "@/lib/domain/types";

type HabitCardProps = {
  challengeTitle?: string | null;
  completedToday?: boolean;
  goalTitle?: string | null;
  habit: Habit;
  skillTitle?: string | null;
  weekCompletions: number;
};

const frequencyLabels: Record<string, string> = {
  custom: "Гибкий ритм",
  daily: "Каждый день",
  weekdays: "По будням",
  weekly: "Раз в неделю",
};

export function HabitCard({
  challengeTitle,
  completedToday = false,
  goalTitle,
  habit,
  skillTitle,
  weekCompletions,
}: HabitCardProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [doneToday, setDoneToday] = useState(completedToday);

  async function completeHabit() {
    if (doneToday) {
      return;
    }

    setLoading(true);
    setMessage(null);

    const response = await fetch(`/api/habits/${habit.id}/complete`, { method: "POST" });
    const payload = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setMessage(payload?.error ?? "Не удалось отметить ритуал.");
      return;
    }

    if (payload.alreadyCompleted) {
      setDoneToday(true);
      setMessage("Сегодня этот ритуал уже выполнен. Повторный XP не начисляется.");
    } else {
      setDoneToday(true);
      const unlockedCount = Array.isArray(payload.achievements) ? payload.achievements.length : 0;
      setMessage(
        unlockedCount > 0
          ? `Ритуал выполнен. Начислено ${payload.xpAwarded ?? habit.xp_reward} XP. Открыто достижений: ${unlockedCount}.`
          : `Ритуал выполнен. Начислено ${payload.xpAwarded ?? habit.xp_reward} XP.`,
      );
    }

    router.refresh();
  }

  async function archiveHabit() {
    setLoading(true);
    setMessage(null);

    const response = await fetch(`/api/habits/${habit.id}`, { method: "DELETE" });
    const payload = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setMessage(payload?.error ?? "Не удалось архивировать ритуал.");
      return;
    }

    router.refresh();
  }

  async function updateHabit(formData: FormData) {
    setLoading(true);
    setMessage(null);

    const response = await fetch(`/api/habits/${habit.id}`, {
      body: JSON.stringify({
        description: formData.get("description"),
        frequency: formData.get("frequency"),
        life_area: formData.get("life_area"),
        title: formData.get("title"),
        xp_reward: Number(formData.get("xp_reward") ?? habit.xp_reward),
      }),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    });
    const payload = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setMessage(payload?.error ?? "Не удалось обновить ритуал.");
      return;
    }

    setEditing(false);
    router.refresh();
  }

  return (
    <Card variant="interactive">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">{formatLifeArea(habit.life_area)}</Badge>
            <Badge variant="muted">{frequencyLabels[habit.frequency] ?? habit.frequency}</Badge>
            <Badge variant="success">{habit.xp_reward} XP</Badge>
            {doneToday ? <Badge variant="success">Выполнено сегодня</Badge> : null}
          </div>
          <h2 className="mt-4 text-xl font-semibold text-foreground">{habit.title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {habit.description ?? "Ритуал прокачки."}
          </p>
        </div>
        {doneToday ? (
          <Button disabled size="sm" variant="secondary">
            Уже выполнено сегодня
          </Button>
        ) : (
          <Button loading={loading} onClick={completeHabit} size="sm">
            Отметить выполненной
          </Button>
        )}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[var(--radius-control)] border border-border bg-surface-muted px-4 py-3">
          <p className="text-xs text-muted-foreground">Streak</p>
          <p className="mt-1 text-lg font-semibold">{habit.streak_current}</p>
        </div>
        <div className="rounded-[var(--radius-control)] border border-border bg-surface-muted px-4 py-3">
          <p className="text-xs text-muted-foreground">Лучшая серия</p>
          <p className="mt-1 text-lg font-semibold">{habit.streak_best}</p>
        </div>
        <div className="rounded-[var(--radius-control)] border border-border bg-surface-muted px-4 py-3">
          <p className="text-xs text-muted-foreground">За неделю</p>
          <p className="mt-1 text-lg font-semibold">{weekCompletions}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-2 text-sm text-muted-foreground">
        <p>Связь с целью: {goalTitle ?? "не задана"}</p>
        <p>Связь с навыком: {skillTitle ?? "не задана"}</p>
        <p>Связь с челленджем: {challengeTitle ?? "не задана"}</p>
      </div>

      {editing ? (
        <form action={updateHabit} className="mt-5 grid gap-4 border-t border-border pt-5">
          <Input defaultValue={habit.title} label="Название" name="title" required />
          <Textarea defaultValue={habit.description ?? ""} label="Описание" name="description" />
          <div className="grid gap-4 sm:grid-cols-3">
            <Select defaultValue={habit.life_area} label="Сфера" name="life_area">
              <option value="projects">Личные проекты</option>
              <option value="career">Карьера</option>
              <option value="education">Образование</option>
              <option value="health">Здоровье</option>
              <option value="finance">Финансы</option>
              <option value="relationships">Отношения</option>
              <option value="creativity">Творчество</option>
            </Select>
            <Select defaultValue={habit.frequency} label="Частота" name="frequency">
              <option value="daily">Каждый день</option>
              <option value="weekdays">По будням</option>
              <option value="weekly">Раз в неделю</option>
              <option value="custom">Гибкий ритм</option>
            </Select>
            <Input defaultValue={habit.xp_reward} label="XP" min={0} name="xp_reward" type="number" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button loading={loading} size="sm" type="submit">
              Сохранить
            </Button>
            <Button onClick={() => setEditing(false)} size="sm" type="button" variant="secondary">
              Отмена
            </Button>
          </div>
        </form>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3 border-t border-border pt-5">
        <Button onClick={() => setEditing((value) => !value)} size="sm" variant="secondary">
          Редактировать
        </Button>
        <Button loading={loading} onClick={archiveHabit} size="sm" variant="danger">
          Архивировать
        </Button>
      </div>

      {message ? (
        <p className="mt-4 rounded-[var(--radius-control)] border border-[color:var(--border-primary-subtle)] bg-primary-subtle/40 px-4 py-3 text-sm text-foreground">
          {message}
        </p>
      ) : null}
    </Card>
  );
}
