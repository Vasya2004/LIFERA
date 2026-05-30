"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CreateHealthEntryForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(formData: FormData) {
    setLoading(true);
    setError(null);
    setMessage(null);

    const response = await fetch("/api/health/metrics", {
      body: JSON.stringify({
        activity_minutes: Number(formData.get("activity_minutes") ?? 0),
        energy_level: Number(formData.get("energy_level") ?? 5),
        note: formData.get("note"),
        recovery_score: Number(formData.get("recovery_score") ?? 5),
        sleep_hours: Number(formData.get("sleep_hours") ?? 7),
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    const payload = await response.json().catch(() => ({ error: "Create failed." }));
    setLoading(false);

    if (!response.ok) {
      setError(payload.error ?? "Не удалось сохранить запись.");
      return;
    }

    setMessage("Wellness-запись сохранена.");
    router.refresh();
  }

  return (
    <form action={submit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          defaultValue={5}
          label="Энергия (1–10)"
          max={10}
          min={1}
          name="energy_level"
          type="number"
        />
        <Input
          defaultValue={5}
          label="Восстановление (1–10)"
          max={10}
          min={1}
          name="recovery_score"
          type="number"
        />
        <Input
          defaultValue={7}
          label="Сон, часы"
          max={14}
          min={0}
          name="sleep_hours"
          step="0.5"
          type="number"
        />
        <Input
          defaultValue={30}
          label="Активность, минуты"
          max={600}
          min={0}
          name="activity_minutes"
          type="number"
        />
      </div>
      <Textarea label="Заметка" name="note" placeholder="Краткий контекст дня без медицинских деталей" />
      {error ? (
        <p className="rounded-[var(--radius-control)] border border-danger/25 bg-danger-subtle px-4 py-3 text-sm text-danger-foreground">
          {error}
        </p>
      ) : null}
      <Button loading={loading} type="submit">
        Сохранить wellness-запись
      </Button>
      {message ? (
        <p className="rounded-[var(--radius-control)] border border-[color:var(--border-primary-subtle)] bg-primary-subtle/40 px-4 py-3 text-sm text-foreground">
          {message}
        </p>
      ) : null}
    </form>
  );
}
