"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast-provider";
import { SKILL_CATEGORIES } from "@/lib/domain/skills";
import type { Skill } from "@/lib/domain/types";
import { handleMutationError, showMutationSuccess } from "@/lib/ui/feedback";

type SkillEditFormProps = {
  onSaved?: () => void;
  skill: Pick<Skill, "category" | "id" | "level" | "progress" | "title">;
};

export function SkillEditForm({ onSaved, skill }: SkillEditFormProps) {
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

    const response = await fetch(`/api/skills/${skill.id}`, {
      body: JSON.stringify({
        category: formData.get("category"),
        level: Number(formData.get("level") ?? skill.level),
        progress: Number(formData.get("progress") ?? skill.progress),
        title: String(formData.get("title") ?? "").trim(),
      }),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    });

    const payload = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      handleMutationError(toast, payload, "Не удалось сохранить навык.");
      setError(payload?.error ?? "Не удалось сохранить навык.");
      return;
    }

    showMutationSuccess(toast, "Изменения сохранены");
    onSaved?.();
    router.refresh();
  }

  return (
    <form className="mt-3 grid gap-4 pt-2" onSubmit={handleSubmit}>
      <Input defaultValue={skill.title} label="Название" name="title" required />
      <Select defaultValue={skill.category} label="Категория" name="category">
        {Object.entries(SKILL_CATEGORIES).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input defaultValue={skill.level} label="Уровень" min={1} name="level" type="number" />
        <Input
          defaultValue={skill.progress}
          label="Прогресс, %"
          max={100}
          min={0}
          name="progress"
          type="number"
        />
      </div>
      {error ? (
        <p className="rounded-[var(--radius-control)] border border-danger/25 bg-danger-subtle px-4 py-3 text-sm text-danger-foreground">
          {error}
        </p>
      ) : null}
      <Button loading={loading} loadingLabel="Сохраняем..." size="sm" type="submit" variant="secondary">
        Сохранить
      </Button>
    </form>
  );
}
