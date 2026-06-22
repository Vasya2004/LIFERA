"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, CheckCircle2, Footprints, Moon, Smile, Wind, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";
import { handleMutationError, showMutationSuccess } from "@/lib/ui/feedback";
import type { HealthSnapshot } from "@/lib/domain/health";

type HealthCheckinProps = {
  disabled?: boolean;
  todayRecord: HealthSnapshot | null;
};

const METRICS = [
  {
    color: "bg-amber-500",
    hint: "1 — полное истощение, 5 — много сил",
    icon: <Zap className="text-amber-500" size={15} />,
    key: "energy",
    label: "Энергия",
  },
  {
    color: "bg-blue-500",
    hint: "1 — почти не спал, 5 — выспался",
    icon: <Moon className="text-blue-500" size={15} />,
    key: "sleep",
    label: "Сон",
  },
  {
    color: "bg-yellow-500",
    hint: "1 — плохое настроение, 5 — отличное",
    icon: <Smile className="text-yellow-500" size={15} />,
    key: "mood",
    label: "Настроение",
  },
  {
    color: "bg-rose-500",
    hint: "1 — нет стресса, 5 — сильный стресс",
    icon: <Wind className="text-rose-500" size={15} />,
    key: "stress",
    label: "Стресс",
  },
  {
    color: "bg-green-500",
    hint: "1 — совсем без движения, 5 — активная тренировка",
    icon: <Footprints className="text-green-500" size={15} />,
    key: "activity",
    label: "Активность",
  },
] as const;

type MetricKey = (typeof METRICS)[number]["key"];

function todayLabel(record: HealthSnapshot) {
  const e = Math.round(record.energy_level * 10);
  const s = record.sleep_hours.toFixed(1);
  const r = Math.round(record.recovery_score * 10);
  return `Энергия ${e} · Сон ${s} ч · Восстановление ${r}`;
}

export function HealthCheckin({ disabled = false, todayRecord }: HealthCheckinProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(!todayRecord);
  const [ratings, setRatings] = useState<Record<MetricKey, number>>({
    activity: 3,
    energy: 3,
    mood: 3,
    sleep: 3,
    stress: 2,
  });
  const [note, setNote] = useState("");

  function setRating(key: MetricKey, value: number) {
    setRatings((prev) => ({ ...prev, [key]: value }));
  }

  async function submit() {
    if (loading) {
      return;
    }

    setLoading(true);

    // Map 1–5 ratings to actual stored fields:
    // energy_level: 1–10 (multiply by 2)
    // sleep_hours: 1→3h, 2→5h, 3→6.5h, 4→7.5h, 5→9h
    // recovery_score: stress inverted — stress 1 = recovery 10, stress 5 = recovery 2
    // activity_minutes: 1→10m, 2→20m, 3→30m, 4→45m, 5→60m
    const sleepMap = [0, 3, 5, 6.5, 7.5, 9];
    const activityMap = [0, 10, 20, 30, 45, 60];

    const response = await fetch("/api/health/metrics", {
      body: JSON.stringify({
        activity_minutes: activityMap[ratings.activity] ?? 30,
        energy_level: ratings.energy * 2,
        note: note.trim() || null,
        recovery_score: (6 - ratings.stress) * 2,
        sleep_hours: sleepMap[ratings.sleep] ?? 6.5,
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

    showMutationSuccess(toast, "Запись check-in сохранена");
    setShowForm(false);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/5 dark:bg-zinc-900/70">
      <div className="flex items-center gap-2">
        <div className="grid size-8 place-items-center rounded-lg bg-rose-50 dark:bg-rose-500/10">
          <Activity className="text-rose-500 dark:text-rose-400" size={15} />
        </div>
        <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
          Ежедневный check-in
        </h2>
      </div>

      {todayRecord && !showForm ? (
        /* Today already entered */
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-500/20 dark:bg-green-500/10">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 shrink-0 text-green-600 dark:text-green-400" size={16} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                Сегодняшняя запись уже добавлена
              </p>
              <p className="mt-0.5 text-xs text-green-700 dark:text-green-400">
                {todayLabel(todayRecord)}
              </p>
            </div>
          </div>
          <button
            className="mt-3 text-xs font-semibold text-green-700 underline-offset-2 hover:underline dark:text-green-400"
            onClick={() => setShowForm(true)}
            type="button"
          >
            Обновить запись
          </button>
        </div>
      ) : (
        /* Rating form */
        <div className="mt-4 grid gap-3">
          {METRICS.map((m) => (
            <div key={m.key}>
              <div className="mb-1.5 flex items-center gap-2">
                {m.icon}
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {m.label}
                </span>
                <span className="ml-auto text-[11px] text-zinc-400 dark:text-zinc-600">
                  {m.hint}
                </span>
              </div>
              <div className="flex gap-1.5">
                {([1, 2, 3, 4, 5] as const).map((v) => (
                  <button
                    className={[
                      "flex h-9 flex-1 items-center justify-center rounded-lg text-sm font-semibold transition-colors",
                      ratings[m.key] === v
                        ? `${m.color} text-white`
                        : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700",
                    ].join(" ")}
                    disabled={disabled}
                    key={v}
                    onClick={() => setRating(m.key, v)}
                    type="button"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              htmlFor="checkin-note"
            >
              Заметка дня{" "}
              <span className="text-xs font-normal text-zinc-400 dark:text-zinc-600">
                (необязательно)
              </span>
            </label>
            <textarea
              className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-rose-400 focus:ring-1 focus:ring-rose-400/30 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-600 dark:focus:border-rose-500/50"
              disabled={disabled}
              id="checkin-note"
              onChange={(e) => setNote(e.target.value)}
              placeholder="Краткий контекст дня..."
              rows={2}
              value={note}
            />
          </div>

          <Button
            className="w-full"
            disabled={disabled}
            loading={loading}
            loadingLabel="Сохраняем..."
            onClick={submit}
          >
            Сохранить запись
          </Button>

          <p className="text-center text-[11px] text-zinc-400 dark:text-zinc-600">
            Стресс 1 = спокойно · Стресс 5 = высокий стресс (учитывается инверсно)
          </p>
        </div>
      )}
    </div>
  );
}
