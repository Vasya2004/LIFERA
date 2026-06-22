"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlanLimitAlert } from "@/components/ui/plan-limit-alert";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast-provider";
import type { Wish } from "@/lib/domain/types";
import { handleMutationError, showMutationSuccess } from "@/lib/ui/feedback";

type CreateGoalFormProps = {
  onSuccess?: () => void;
  wishes?: Wish[];
};

export function CreateGoalForm({ onSuccess, wishes = [] }: CreateGoalFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isPlanLimit, setIsPlanLimit] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);
    setIsPlanLimit(false);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/goals", {
      body: JSON.stringify({
        description: String(formData.get("description") ?? "").trim() || null,
        life_area: formData.get("life_area"),
        is_primary: formData.get("is_primary") === "on",
        linked_wish_id: String(formData.get("linked_wish_id") ?? "") || null,
        status: formData.get("status") ?? "active",
        target_date: String(formData.get("target_date") ?? "") || null,
        title: String(formData.get("title") ?? "").trim(),
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    const payload = await response.json().catch(() => ({ error: "Не удалось создать цель." }));
    setLoading(false);

    if (!response.ok) {
      const result = handleMutationError(toast, payload, "Не удалось создать цель.");
      setIsPlanLimit(result.isPlanLimit);
      setError(
        typeof payload === "object" && payload && "error" in payload && typeof payload.error === "string"
          ? payload.error
          : "Не удалось создать цель.",
      );
      return;
    }

    showMutationSuccess(
      toast,
      "Цель создана",
      "Теперь добавьте привычку, чтобы запустить движение.",
    );
    form.reset();
    router.refresh();
    onSuccess?.();
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <Input label="Название" name="title" placeholder="Название цели" required />
      <Input label="Почему важно" name="description" placeholder="Что изменится, когда цель будет закрыта" />
      <Select defaultValue="active" label="Статус" name="status">
        <option value="active">Активная</option>
        <option value="backlog">В планах</option>
      </Select>
      <Select label="Сфера жизни" name="life_area">
        <option value="projects">Личные проекты</option>
        <option value="career">Карьера</option>
        <option value="education">Обучение</option>
        <option value="health">Здоровье</option>
        <option value="finance">Финансы</option>
        <option value="creativity">Творчество</option>
        <option value="relationships">Отношения</option>
      </Select>
      <Input label="Целевая дата" name="target_date" type="date" />
      {wishes.length > 0 ? (
        <Select label="Связанное желание" name="linked_wish_id">
          <option value="">Без желания</option>
          {wishes
            .filter((wish) => wish.status !== "archived")
            .map((wish) => (
              <option key={wish.id} value={wish.id}>
                {wish.title}
              </option>
            ))}
        </Select>
      ) : null}
      <label className="flex items-start gap-3 rounded-[var(--radius-control)] border border-border bg-surface-muted px-4 py-3 text-sm text-foreground">
        <input className="mt-1 accent-[var(--primary)]" name="is_primary" type="checkbox" />
        <span>
          <span className="block font-medium">Сделать главной целью</span>
          <span className="mt-1 block text-muted-foreground">
            Lifera будет использовать её как основной фокус на Главной.
          </span>
        </span>
      </label>
      {error ? (
        isPlanLimit ? (
          <PlanLimitAlert message={error} />
        ) : (
          <p className="rounded-[var(--radius-control)] border border-danger/25 bg-danger-subtle px-4 py-3 text-sm text-danger-foreground">
            {error}
          </p>
        )
      ) : null}
      <Button loading={loading} loadingLabel="Создаём..." type="submit">
        Создать цель
      </Button>
    </form>
  );
}
