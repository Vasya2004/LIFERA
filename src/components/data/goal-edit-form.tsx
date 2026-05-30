"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Goal } from "@/lib/domain/types";

type GoalEditFormProps = {
  goal: Pick<
    Goal,
    "description" | "id" | "life_area" | "status" | "target_date" | "title"
  >;
};

export function GoalEditForm({ goal }: GoalEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData(event.currentTarget);

    const response = await fetch(`/api/goals/${goal.id}`, {
      body: JSON.stringify({
        description: String(formData.get("description") ?? "").trim() || null,
        life_area: formData.get("life_area"),
        status: formData.get("status"),
        target_date: String(formData.get("target_date") ?? "") || null,
        title: String(formData.get("title") ?? "").trim(),
      }),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    });

    const payload = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setError(payload?.error ?? "Не удалось сохранить цель.");
      return;
    }

    setMessage("Цель обновлена.");
    router.refresh();
  }

  return (
    <form className="mt-4 grid gap-4 border-t border-border pt-4" onSubmit={handleSubmit}>
      <p className="text-sm font-semibold text-foreground">Редактирование</p>
      <Input defaultValue={goal.title} label="Название" name="title" required />
      <Input
        defaultValue={goal.description ?? ""}
        label="Контекст"
        name="description"
      />
      <Select defaultValue={goal.life_area} label="Сфера жизни" name="life_area">
        <option value="projects">Личные проекты</option>
        <option value="career">Карьера</option>
        <option value="education">Образование</option>
        <option value="health">Здоровье</option>
        <option value="finance">Финансы</option>
        <option value="creativity">Творчество</option>
        <option value="relationships">Отношения</option>
      </Select>
      <Input
        defaultValue={goal.target_date ?? ""}
        label="Целевая дата"
        name="target_date"
        type="date"
      />
      <Select defaultValue={goal.status} label="Статус" name="status">
        <option value="active">Активная</option>
        <option value="backlog">Бэклог</option>
        <option value="completed">Завершена</option>
        <option value="archived">В архиве</option>
      </Select>
      {error ? (
        <p className="text-sm text-danger-foreground">{error}</p>
      ) : null}
      {message ? (
        <p className="text-sm text-muted-foreground">{message}</p>
      ) : null}
      <Button loading={loading} size="sm" type="submit" variant="secondary">
        Сохранить изменения
      </Button>
    </form>
  );
}
