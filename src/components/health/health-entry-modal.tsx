"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast-provider";
import { handleMutationError, showMutationSuccess } from "@/lib/ui/feedback";

type HealthEntryModalProps = {
  onClose: () => void;
};

export function HealthEntryModal({ onClose }: HealthEntryModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [energy, setEnergy] = useState("5");
  const [recovery, setRecovery] = useState("5");
  const [sleep, setSleep] = useState("7");
  const [activity, setActivity] = useState("30");

  async function submit() {
    if (loading) {
      return;
    }

    setLoading(true);

    const response = await fetch("/api/health/metrics", {
      body: JSON.stringify({
        activity_minutes: Number(activity) || 0,
        energy_level: Number(energy) || 5,
        recovery_score: Number(recovery) || 5,
        sleep_hours: Number(sleep) || 7,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    const payload = await response.json().catch(() => ({ error: "Не удалось сохранить." }));
    setLoading(false);

    if (!response.ok) {
      handleMutationError(toast, payload, "Не удалось сохранить запись.");
      return;
    }

    showMutationSuccess(toast, "Запись состояния добавлена");
    onClose();
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <Card className="w-full max-w-lg bg-white dark:bg-zinc-900" variant="elevated">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">
            Новая запись состояния
          </h2>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-1 text-sm text-zinc-400">
          Короткая запись энергии, сна и активности — без медицинских деталей.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">
              Энергия (1–10)
            </label>
            <input
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-950 outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              inputMode="numeric"
              onChange={(e) => setEnergy(e.target.value)}
              placeholder="5"
              type="text"
              value={energy}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">
              Восстановление (1–10)
            </label>
            <input
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-950 outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              inputMode="numeric"
              onChange={(e) => setRecovery(e.target.value)}
              placeholder="5"
              type="text"
              value={recovery}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Сон, часы</label>
            <input
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-950 outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              inputMode="decimal"
              onChange={(e) => setSleep(e.target.value)}
              placeholder="7"
              type="text"
              value={sleep}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">
              Активность, минуты
            </label>
            <input
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-950 outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              inputMode="numeric"
              onChange={(e) => setActivity(e.target.value)}
              placeholder="30"
              type="text"
              value={activity}
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <Button onClick={onClose} variant="secondary">
            Отмена
          </Button>
          <Button loading={loading} loadingLabel="Сохраняем..." onClick={submit}>
            Сохранить
          </Button>
        </div>
      </Card>
    </div>
  );
}
