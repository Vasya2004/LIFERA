"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast-provider";
import { handleMutationError, showMutationSuccess } from "@/lib/ui/feedback";
import type { FinanceSnapshot } from "@/lib/domain/finance";

type CreateFinanceEntryFormProps = {
  initialData?: FinanceSnapshot;
  onSuccess?: () => void;
};

export function CreateFinanceEntryForm({ initialData, onSuccess }: CreateFinanceEntryFormProps) {
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

    const response = await fetch("/api/finance/metrics", {
      body: JSON.stringify({
        date: initialData?.date,
        monthly_expenses: Number(formData.get("monthly_expenses") ?? 0),
        monthly_income: Number(formData.get("monthly_income") ?? 0),
        note: formData.get("note"),
        savings_amount: Number(formData.get("savings_amount") ?? 0),
        target_amount: Number(formData.get("target_amount") ?? 0),
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    const payload = await response.json().catch(() => ({ error: "Не удалось сохранить запись." }));
    setLoading(false);

    if (!response.ok) {
      handleMutationError(toast, payload, "Не удалось сохранить снимок.");
      setError(payload.error ?? "Не удалось сохранить снимок.");
      return;
    }

    showMutationSuccess(toast, initialData ? "Финансовый снимок обновлён" : "Финансовый снимок добавлен");
    router.refresh();
    onSuccess?.();
  }

  return (
    <form action={submit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input defaultValue={initialData?.savings_amount ?? 0} label="Текущая сумма (капитал)" min={0} name="savings_amount" type="number" />
        <Input defaultValue={initialData?.target_amount ?? 0} label="Целевая сумма" min={0} name="target_amount" type="number" />
        <Input defaultValue={initialData?.monthly_income ?? 0} label="Доход в месяц" min={0} name="monthly_income" type="number" />
        <Input defaultValue={initialData?.monthly_expenses ?? 0} label="Расходы в месяц" min={0} name="monthly_expenses" type="number" />
      </div>
      <Textarea defaultValue={initialData?.note ?? ""} label="Заметка" name="note" placeholder="Контекст цели накоплений или финансовой устойчивости" />
      {error ? (
        <p className="rounded-[var(--radius-control)] border border-danger/25 bg-danger-subtle px-4 py-3 text-sm text-danger-foreground">
          {error}
        </p>
      ) : null}
      <Button loading={loading} loadingLabel="Сохраняем..." type="submit">
        Сохранить снимок
      </Button>
    </form>
  );
}
