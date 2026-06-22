"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast-provider";
import type { Challenge } from "@/lib/domain/types";
import { handleMutationError, showMutationSuccess } from "@/lib/ui/feedback";

type ChallengeEditFormProps = {
  challenge: Pick<
    Challenge,
    "description" | "difficulty" | "duration_days" | "goal_id" | "id" | "status" | "title"
  >;
  goals: Array<{ id: string; title: string }>;
  onCancel?: () => void;
  onSaved?: () => void;
};

export function ChallengeEditForm({
  challenge,
  goals,
  onCancel,
  onSaved,
}: ChallengeEditFormProps) {
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
    const goalId = String(formData.get("goal_id") ?? "");

    const response = await fetch(`/api/challenges/${challenge.id}`, {
      body: JSON.stringify({
        description: String(formData.get("description") ?? "").trim() || null,
        difficulty: formData.get("difficulty"),
        duration_days: Number(formData.get("duration_days") ?? 7),
        goal_id: goalId || null,
        status: formData.get("status"),
        title: String(formData.get("title") ?? "").trim(),
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
      <Input defaultValue={challenge.title} label="Название" name="title" required />
      <Input
        defaultValue={challenge.description ?? ""}
        label="Описание"
        name="description"
      />
      <Select defaultValue={challenge.goal_id ?? ""} label="Связанная цель" name="goal_id">
        <option value="">Без привязки</option>
        {goals.map((goal) => (
          <option key={goal.id} value={goal.id}>
            {goal.title}
          </option>
        ))}
      </Select>
      <Input
        defaultValue={challenge.duration_days}
        label="Длительность, дней"
        min={1}
        name="duration_days"
        type="number"
      />
      <Select defaultValue={challenge.difficulty} label="Сложность" name="difficulty">
        <option value="easy">Лёгкая</option>
        <option value="medium">Средняя</option>
        <option value="hard">Сложная</option>
      </Select>
      <Select defaultValue={challenge.status} label="Статус" name="status">
        <option value="active">Активная</option>
        <option value="paused">На паузе</option>
        <option value="completed">Завершена</option>
        <option value="archived">В архиве</option>
      </Select>
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
