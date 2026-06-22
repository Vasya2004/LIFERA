"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlanLimitAlert } from "@/components/ui/plan-limit-alert";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast-provider";
import { handleMutationError, showMutationSuccess } from "@/lib/ui/feedback";

type GoalOption = {
  id: string;
  title: string;
};

type CreateChallengeFormProps = {
  goals: GoalOption[];
  initialTitle?: string;
  initialDescription?: string;
  initialDurationDays?: number;
  initialDifficulty?: string;
  templateId?: string;
};

export function CreateChallengeForm({
  goals,
  initialDescription = "",
  initialDifficulty = "medium",
  initialDurationDays = 7,
  initialTitle = "",
  templateId,
}: CreateChallengeFormProps) {
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

    const formData = new FormData(event.currentTarget);
    const goalId = String(formData.get("goal_id") ?? "");

    const response = await fetch("/api/challenges", {
      body: JSON.stringify({
        description: String(formData.get("description") ?? "").trim() || null,
        difficulty: formData.get("difficulty"),
        duration_days: Number(formData.get("duration_days") ?? 7),
        goal_id: goalId || null,
        template_id: templateId ?? null,
        title: String(formData.get("title") ?? "").trim(),
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    const payload = await response.json().catch(() => ({ error: "Не удалось создать привычку." }));
    setLoading(false);

    if (!response.ok) {
      const result = handleMutationError(toast, payload, "Не удалось создать привычку.");
      setIsPlanLimit(result.isPlanLimit);
      setError(
        typeof payload === "object" && payload && "error" in payload && typeof payload.error === "string"
          ? payload.error
          : "Не удалось создать привычку.",
      );
      return;
    }

    showMutationSuccess(toast, "Привычка создана", "Откройте этапы и начните движение.");
    const challengeId = payload?.challenge?.id;
    router.refresh();
    if (challengeId) {
      router.push(`/challenges/${challengeId}`);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <Input
        defaultValue={initialTitle}
        key={`title-${initialTitle}-${templateId ?? "custom"}`}
        label="Название"
        name="title"
        required
      />
      <Input
        defaultValue={initialDescription}
        key={`desc-${initialDescription}-${templateId ?? "custom"}`}
        label="Описание"
        name="description"
      />
      <Select defaultValue={goals[0]?.id ?? ""} label="Связанная цель" name="goal_id">
        <option value="">Без привязки</option>
        {goals.map((goal) => (
          <option key={goal.id} value={goal.id}>
            {goal.title}
          </option>
        ))}
      </Select>
      <Input
        defaultValue={initialDurationDays}
        key={`days-${initialDurationDays}`}
        label="Длительность, дней"
        min={1}
        name="duration_days"
        type="number"
      />
      <Select
        defaultValue={initialDifficulty}
        key={`diff-${initialDifficulty}`}
        label="Сложность"
        name="difficulty"
      >
        <option value="easy">Лёгкая</option>
        <option value="medium">Средняя</option>
        <option value="hard">Сложная</option>
      </Select>
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
        {templateId ? "Из шаблона" : "Создать привычку"}
      </Button>
    </form>
  );
}
