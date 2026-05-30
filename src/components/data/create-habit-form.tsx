"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlanLimitAlert } from "@/components/ui/plan-limit-alert";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { isPlanLimitPayload } from "@/lib/api/plan-limit";

type CreateHabitFormProps = {
  challenges: Array<{ id: string; title: string }>;
  goals: Array<{ id: string; title: string }>;
  skills: Array<{ id: string; title: string }>;
};

export function CreateHabitForm({ challenges, goals, skills }: CreateHabitFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlanLimit, setIsPlanLimit] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(formData: FormData) {
    setLoading(true);
    setError(null);
    setIsPlanLimit(false);
    setMessage(null);

    const response = await fetch("/api/habits", {
      body: JSON.stringify({
        description: formData.get("description"),
        frequency: formData.get("frequency"),
        life_area: formData.get("life_area"),
        linked_challenge_id: formData.get("linked_challenge_id") || null,
        linked_goal_id: formData.get("linked_goal_id") || null,
        linked_skill_id: formData.get("linked_skill_id") || null,
        title: formData.get("title"),
        xp_reward: Number(formData.get("xp_reward") ?? 10),
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    const payload = await response.json().catch(() => ({ error: "Create failed." }));
    setLoading(false);

    if (!response.ok) {
      setIsPlanLimit(isPlanLimitPayload(payload));
      setError(payload.error ?? "Не удалось создать ритуал.");
      return;
    }

    setMessage("Ритуал прокачки создан.");
    router.refresh();
  }

  return (
    <form action={submit} className="grid gap-4">
      <Input label="Название ритуала" name="title" required />
      <Textarea
        label="Описание"
        name="description"
        placeholder="Краткое описание"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Сфера жизни" name="life_area">
          <option value="projects">Личные проекты</option>
          <option value="career">Карьера</option>
          <option value="education">Образование</option>
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
      <Input defaultValue={10} label="XP за регулярность" min={0} name="xp_reward" type="number" />
      <Select label="Связь с целью" name="linked_goal_id">
        <option value="">Без привязки</option>
        {goals.map((goal) => (
          <option key={goal.id} value={goal.id}>
            {goal.title}
          </option>
        ))}
      </Select>
      <Select label="Связь с навыком" name="linked_skill_id">
        <option value="">Без привязки</option>
        {skills.map((skill) => (
          <option key={skill.id} value={skill.id}>
            {skill.title}
          </option>
        ))}
      </Select>
      <Select label="Связь с челленджем" name="linked_challenge_id">
        <option value="">Без привязки</option>
        {challenges.map((challenge) => (
          <option key={challenge.id} value={challenge.id}>
            {challenge.title}
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
      <Button loading={loading} type="submit">
        Создать ритуал
      </Button>
      {message ? (
        <p className="rounded-[var(--radius-control)] border border-[color:var(--border-primary-subtle)] bg-primary-subtle/40 px-4 py-3 text-sm text-foreground">
          {message}
        </p>
      ) : null}
    </form>
  );
}
