"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast-provider";
import { handleMutationError, showMutationSuccess } from "@/lib/ui/feedback";

const hardCategories = [
  ["tech", "Программирование"],
  ["language", "Английский"],
  ["product", "UX/UI дизайн"],
  ["tech", "AI-инструменты"],
  ["product", "Маркетинг"],
  ["finance_literacy", "Финансы"],
] as const;

const softCategories = [
  ["general", "Дисциплина"],
  ["communication", "Коммуникация"],
  ["general", "Фокус"],
  ["communication", "Лидерство"],
  ["general", "Критическое мышление"],
  ["general", "Самоорганизация"],
] as const;

type CreateSkillFormProps = {
  onSuccess?: () => void;
};

export function CreateSkillForm({ onSuccess }: CreateSkillFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(formData: FormData) {
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);

    const response = await fetch("/api/skills", {
      body: JSON.stringify({
        category: formData.get("category"),
        title: formData.get("title"),
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    const payload = await response.json().catch(() => ({ error: "Не удалось создать навык." }));
    setLoading(false);

    if (!response.ok) {
      handleMutationError(toast, payload, "Не удалось создать навык.");
      setError(payload.error ?? "Не удалось создать навык.");
      return;
    }

    showMutationSuccess(toast, "Навык добавлен");
    router.refresh();
    onSuccess?.();
  }

  return (
    <form action={submit} className="grid gap-4">
      <Input label="Название навыка" name="title" placeholder="Например: Frontend" required />
      <Select defaultValue="tech" label="Категория" name="category">
        <optgroup label="Hard skills">
          {hardCategories.map(([value, label]) => (
            <option key={`${value}-${label}`} value={value}>
              {label}
            </option>
          ))}
        </optgroup>
        <optgroup label="Soft skills">
          {softCategories.map(([value, label]) => (
            <option key={`${value}-${label}`} value={value}>
              {label}
            </option>
          ))}
        </optgroup>
      </Select>
      <Select label="Тип" name="skill_type">
        <option value="hard">Hard skill</option>
        <option value="soft">Soft skill</option>
      </Select>
      <Input defaultValue={300} label="Целевой XP уровня" min={100} name="target_xp" type="number" />
      <label className="flex items-start gap-3 rounded-xl border border-white/5 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
        <input className="mt-1 accent-[var(--primary)]" name="is_primary" type="checkbox" />
        <span>
          <span className="block font-semibold text-white">Сделать главным навыком</span>
          <span className="mt-1 block text-xs text-zinc-400">
            В текущей версии сохраняется как визуальная настройка формы.
          </span>
        </span>
      </label>
      {error ? (
        <p className="rounded-[var(--radius-control)] border border-danger/25 bg-danger-subtle px-4 py-3 text-sm text-danger-foreground">
          {error}
        </p>
      ) : null}
      <Button loading={loading} loadingLabel="Создаём..." type="submit">
        Добавить навык
      </Button>
    </form>
  );
}
