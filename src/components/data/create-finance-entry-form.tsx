"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CreateFinanceEntryForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(formData: FormData) {
    setLoading(true);
    setError(null);
    setMessage(null);

    const response = await fetch("/api/finance/metrics", {
      body: JSON.stringify({
        monthly_expenses: Number(formData.get("monthly_expenses") ?? 0),
        monthly_income: Number(formData.get("monthly_income") ?? 0),
        note: formData.get("note"),
        savings_amount: Number(formData.get("savings_amount") ?? 0),
        target_amount: Number(formData.get("target_amount") ?? 0),
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

    setMessage("Финансовый snapshot сохранён.");
    router.refresh();
  }

  return (
    <form action={submit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input defaultValue={0} label="Накопления" min={0} name="savings_amount" type="number" />
        <Input defaultValue={0} label="Целевая сумма" min={0} name="target_amount" type="number" />
        <Input defaultValue={0} label="Доход в месяц" min={0} name="monthly_income" type="number" />
        <Input
          defaultValue={0}
          label="Расходы в месяц"
          min={0}
          name="monthly_expenses"
          type="number"
        />
      </div>
      <Textarea
        label="Заметка"
        name="note"
        placeholder="Контекст цели накоплений или финансовой устойчивости"
      />
      {error ? (
        <p className="rounded-[var(--radius-control)] border border-danger/25 bg-danger-subtle px-4 py-3 text-sm text-danger-foreground">
          {error}
        </p>
      ) : null}
      <Button loading={loading} type="submit">
        Сохранить snapshot
      </Button>
      {message ? (
        <p className="rounded-[var(--radius-control)] border border-[color:var(--border-primary-subtle)] bg-primary-subtle/40 px-4 py-3 text-sm text-foreground">
          {message}
        </p>
      ) : null}
    </form>
  );
}
