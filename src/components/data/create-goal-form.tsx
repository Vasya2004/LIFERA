"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlanLimitAlert } from "@/components/ui/plan-limit-alert";
import { Select } from "@/components/ui/select";
import { isPlanLimitPayload } from "@/lib/api/plan-limit";

export function CreateGoalForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPlanLimit, setIsPlanLimit] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);
    setIsPlanLimit(false);
    setMessage(null);

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/goals", {
      body: JSON.stringify({
        description: String(formData.get("description") ?? "").trim() || null,
        life_area: formData.get("life_area"),
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
      setIsPlanLimit(isPlanLimitPayload(payload));
      setError(payload.error ?? "Не удалось создать цель.");
      return;
    }

    setMessage("Цель создана.");
    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <Input label="Название" name="title" placeholder="Название цели" required />
      <Input label="Контекст" name="description" placeholder="Краткий контекст" />
      <Select defaultValue="active" label="Статус" name="status">
        <option value="active">Активная</option>
        <option value="backlog">Бэклог</option>
      </Select>
      <Select label="Сфера жизни" name="life_area">
        <option value="projects">Личные проекты</option>
        <option value="career">Карьера</option>
        <option value="education">Образование</option>
        <option value="health">Здоровье</option>
        <option value="finance">Финансы</option>
        <option value="creativity">Творчество</option>
        <option value="relationships">Отношения</option>
      </Select>
      <Input label="Целевая дата" name="target_date" type="date" />
      {error ? (
        isPlanLimit ? (
          <PlanLimitAlert message={error} />
        ) : (
          <p className="rounded-[var(--radius-control)] border border-danger/25 bg-danger-subtle px-4 py-3 text-sm text-danger-foreground">
            {error}
          </p>
        )
      ) : null}
      {message ? (
        <p className="rounded-[var(--radius-control)] border border-[color:var(--border-primary-subtle)] bg-primary-subtle/40 px-4 py-3 text-sm text-foreground">
          {message}
        </p>
      ) : null}
      <Button loading={loading} type="submit">
        Создать цель
      </Button>
    </form>
  );
}
