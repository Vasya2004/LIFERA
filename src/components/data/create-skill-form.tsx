"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SKILL_CATEGORIES } from "@/lib/domain/skills";

export function CreateSkillForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(formData: FormData) {
    setLoading(true);
    setError(null);
    setMessage(null);

    const response = await fetch("/api/skills", {
      body: JSON.stringify({
        category: formData.get("category"),
        title: formData.get("title"),
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    const payload = await response.json().catch(() => ({ error: "Create failed." }));
    setLoading(false);

    if (!response.ok) {
      setError(payload.error ?? "Не удалось создать навык.");
      return;
    }

    setMessage("Навык добавлен.");
    router.refresh();
  }

  return (
    <form action={submit} className="grid gap-4">
      <Input label="Название навыка" name="title" placeholder="Например: Frontend" required />
      <Select defaultValue="tech" label="Категория" name="category">
        {Object.entries(SKILL_CATEGORIES).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
      {error ? (
        <p className="rounded-[var(--radius-control)] border border-danger/25 bg-danger-subtle px-4 py-3 text-sm text-danger-foreground">
          {error}
        </p>
      ) : null}
      <Button loading={loading} type="submit">
        Добавить навык
      </Button>
      {message ? (
        <p className="rounded-[var(--radius-control)] border border-[color:var(--border-primary-subtle)] bg-primary-subtle/40 px-4 py-3 text-sm text-foreground">
          {message}
        </p>
      ) : null}
    </form>
  );
}
