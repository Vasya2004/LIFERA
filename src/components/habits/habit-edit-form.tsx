"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast-provider";
import type { Habit } from "@/lib/domain/types";
import { handleMutationError, showMutationSuccess } from "@/lib/ui/feedback";

type HabitEditFormProps = {
  habit: Habit;
  onCancel?: () => void;
  onSaved?: () => void;
};

export function HabitEditForm({ habit, onCancel, onSaved }: HabitEditFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    const response = await fetch(`/api/habits/${habit.id}`, {
      body: JSON.stringify({
        description: String(formData.get("description") ?? "").trim() || null,
        frequency: formData.get("frequency"),
        life_area: formData.get("life_area"),
        title: String(formData.get("title") ?? "").trim(),
        xp_reward: Number(formData.get("xp_reward") ?? habit.xp_reward),
      }),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    });

    const payload = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      handleMutationError(toast, payload, "Не удалось сохранить привычку.");
      setError(payload?.error ?? "Не удалось сохранить привычку.");
      return;
    }

    showMutationSuccess(toast, "Изменения сохранены");
    router.refresh();
    onSaved?.();
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <Input defaultValue={habit.title} label="Название" name="title" required />
      <Textarea
        defaultValue={habit.description ?? ""}
        label="Описание"
        name="description"
        placeholder="Кратко — зачем эта привычка"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select defaultValue={habit.life_area} label="Сфера жизни" name="life_area">
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
      </div>
      <Input
        defaultValue={habit.xp_reward}
        label="Опыт за выполнение"
        min={0}
        name="xp_reward"
        type="number"
      />

      {error ? <p className="text-sm text-danger-foreground">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <Button loading={loading} loadingLabel="Сохраняем..." type="submit">
          Сохранить
        </Button>
        {onCancel ? (
          <Button onClick={onCancel} type="button" variant="secondary">
            Отмена
          </Button>
        ) : null}
      </div>
    </form>
  );
}
