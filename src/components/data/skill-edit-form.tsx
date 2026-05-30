"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SKILL_CATEGORIES } from "@/lib/domain/skills";
import type { Skill } from "@/lib/domain/types";

type SkillEditFormProps = {
  skill: Pick<Skill, "category" | "id" | "level" | "progress" | "title">;
};

export function SkillEditForm({ skill }: SkillEditFormProps) {
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
      setError(payload?.error ?? "Не удалось сохранить навык.");
      return;
    }

    setMessage("Навык обновлён.");
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
        <Input
          defaultValue={skill.level}
          label="Уровень"
          min={1}
          name="level"
          type="number"
        />
        <Input
          defaultValue={skill.progress}
          label="Progress, %"
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
      <Button loading={loading} size="sm" type="submit" variant="secondary">
        Сохранить
      </Button>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </form>
  );
}
