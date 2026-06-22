"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast-provider";
import { handleMutationError, showMutationSuccess } from "@/lib/ui/feedback";

type CreateHealthEntryFormProps = {
  onSuccess?: () => void;
};

export function CreateHealthEntryForm({ onSuccess }: CreateHealthEntryFormProps) {
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

    const payload = await response.json().catch(() => ({ error: "Не удалось сохранить запись." }));
    setLoading(false);

    if (!response.ok) {
      handleMutationError(toast, payload, "Не удалось сохранить запись.");
      setError(payload.error ?? "Не удалось сохранить запись.");
      return;
    }

    showMutationSuccess(toast, "Запись состояния добавлена");
    router.refresh();
    onSuccess?.();
  }

  return (
    <form action={submit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input defaultValue={5} label="Энергия (1–10)" max={10} min={1} name="energy_level" type="number" />
        <Input defaultValue={5} label="Восстановление (1–10)" max={10} min={1} name="recovery_score" type="number" />
        <Input defaultValue={7} label="Сон, часы" max={14} min={0} name="sleep_hours" step="0.5" type="number" />
        <Input defaultValue={30} label="Активность, минуты" max={600} min={0} name="activity_minutes" type="number" />
      </div>
      <Textarea label="Заметка" name="note" placeholder="Краткий контекст дня без медицинских деталей" />
      {error ? (
        <p className="rounded-[var(--radius-control)] border border-danger/25 bg-danger-subtle px-4 py-3 text-sm text-danger-foreground">
          {error}
        </p>
      ) : null}
      <Button loading={loading} loadingLabel="Сохраняем..." type="submit">
        Сохранить запись
      </Button>
    </form>
  );
}
