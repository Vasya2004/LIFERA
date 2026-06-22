"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlanLimitAlert } from "@/components/ui/plan-limit-alert";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast-provider";
import { handleMutationError, showMutationSuccess } from "@/lib/ui/feedback";

type CreateHabitFormProps = {
  onSuccess?: () => void;
  skills: Array<{ id: string; title: string }>;
};

export function CreateHabitForm({ onSuccess, skills }: CreateHabitFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlanLimit, setIsPlanLimit] = useState(false);

  async function submit(formData: FormData) {
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);
    setIsPlanLimit(false);

    const response = await fetch("/api/habits", {
      body: JSON.stringify({
        description: formData.get("description"),
        frequency: formData.get("frequency"),
        life_area: formData.get("life_area"),
        linked_skill_id: formData.get("linked_skill_id") || null,
        title: formData.get("title"),
        xp_reward: Number(formData.get("xp_reward") ?? 10),
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

    showMutationSuccess(toast, "Привычка создана", "Добавьте её в ежедневный цикл на главной.");
    router.refresh();
    onSuccess?.();
  }

  return (
    <form action={submit} className="grid gap-4" id="create-habit">
      <Input label="Название" name="title" placeholder="Например: 20 минут фокуса" required />
      <Textarea label="Описание" name="description" placeholder="Краткое описание" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Сфера жизни" name="life_area">
          <option value="projects">Личные проекты</option>
          <option value="career">Карьера</option>
          <option value="education">Обучение</option>
          <option value="health">Здоровье</option>
          <option value="finance">Финансы</option>
          <option value="relationships">Отношения</option>
          <option value="creativity">Творчество</option>
        </Select>
        <Select label="Частота" name="frequency">
          <option value="daily">Каждый день</option>
          <option value="weekdays">По будням</option>
          <option value="weekly">Раз в неделю</option>
          <option value="custom">Гибкий ритм</option>
        </Select>
      </div>
      <Input defaultValue={10} label="Опыт" min={0} name="xp_reward" type="number" />
      <Select label="Связь с навыком" name="linked_skill_id">
        <option value="">Без привязки</option>
        {skills.map((skill) => (
          <option key={skill.id} value={skill.id}>
            {skill.title}
          </option>
        ))}
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
        Создать привычку
      </Button>
    </form>
  );
}
