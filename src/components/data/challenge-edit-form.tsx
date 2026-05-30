"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Challenge } from "@/lib/domain/types";

type ChallengeEditFormProps = {
  challenge: Pick<Challenge, "description" | "difficulty" | "duration_days" | "goal_id" | "id" | "title">;
  goals: Array<{ id: string; title: string }>;
};

export function ChallengeEditForm({ challenge, goals }: ChallengeEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const goalId = String(formData.get("goal_id") ?? "");

    const response = await fetch(`/api/challenges/${challenge.id}`, {
      body: JSON.stringify({
        description: String(formData.get("description") ?? "").trim() || null,
        difficulty: formData.get("difficulty"),
        duration_days: Number(formData.get("duration_days") ?? 7),
        goal_id: goalId || null,
        title: String(formData.get("title") ?? "").trim(),
      }),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    });

    const payload = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setError(payload?.error ?? "Не удалось сохранить челлендж.");
      return;
    }

    setMessage("Миссия обновлена.");
    router.refresh();
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
      {error ? <p className="text-sm text-danger-foreground">{error}</p> : null}
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      <Button loading={loading} size="sm" type="submit" variant="secondary">
        Сохранить миссию
      </Button>
    </form>
  );
}
