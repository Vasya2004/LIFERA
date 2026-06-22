"use client";

import { startTransition, useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Minus, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export const STORAGE_KEY = "lifera_problem_zones";

export type ZoneType = "pain" | "tension" | "fatigue" | "discomfort" | "limited_mobility";
export type ZoneSide = "left" | "right" | "both" | "none";

export type ProblemZone = {
  id: string;
  zone: string;
  label: string;
  type: ZoneType;
  side: ZoneSide;
  intensity: number;
  note: string;
  updatedAt: string;
};

const ZONE_AREAS = [
  {
    area: "Голова и шея",
    items: [
      { key: "head", label: "Голова" },
      { key: "neck", label: "Шея" },
    ],
  },
  {
    area: "Верхняя часть тела",
    items: [
      { key: "shoulders", label: "Плечи" },
      { key: "chest", label: "Грудь" },
      { key: "upper_back", label: "Спина" },
    ],
  },
  {
    area: "Середина",
    items: [
      { key: "lower_back", label: "Поясница" },
      { key: "arms", label: "Руки" },
      { key: "wrists", label: "Запястья" },
      { key: "abdomen", label: "Живот" },
    ],
  },
  {
    area: "Нижняя часть тела",
    items: [
      { key: "pelvis", label: "Таз" },
      { key: "knees", label: "Колени" },
      { key: "feet", label: "Стопы" },
    ],
  },
];

const ZONE_TYPES: Array<{ value: ZoneType; label: string }> = [
  { value: "pain", label: "Боль" },
  { value: "tension", label: "Напряжение" },
  { value: "fatigue", label: "Усталость" },
  { value: "discomfort", label: "Дискомфорт" },
  { value: "limited_mobility", label: "Ограничение движения" },
];

const ZONE_SIDES: Array<{ value: ZoneSide; label: string }> = [
  { value: "none", label: "Не указано" },
  { value: "left", label: "Левая" },
  { value: "right", label: "Правая" },
  { value: "both", label: "Обе стороны" },
];

function intensityRingClass(intensity: number): string {
  if (intensity <= 3) return "ring-rose-200 dark:ring-rose-500/30";
  if (intensity <= 6) return "ring-rose-400 dark:ring-rose-400/50";
  return "ring-rose-600 dark:ring-rose-500";
}

function intensityBgClass(intensity: number): string {
  if (intensity <= 3) return "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-300";
  if (intensity <= 6) return "bg-rose-100 border-rose-300 text-rose-800 dark:bg-rose-500/20 dark:border-rose-500/35 dark:text-rose-200";
  return "bg-rose-200 border-rose-400 text-rose-900 dark:bg-rose-500/35 dark:border-rose-500/50 dark:text-rose-100";
}

function loadZones(): ProblemZone[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as ProblemZone[]) : [];
  } catch {
    return [];
  }
}

function persistZones(zones: ProblemZone[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(zones));
  } catch {
    // ignore
  }
}

function formatZoneDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
  } catch {
    return iso;
  }
}

type FormState = {
  type: ZoneType;
  side: ZoneSide;
  intensity: number;
  note: string;
};

const DEFAULT_FORM: FormState = {
  type: "discomfort",
  side: "none",
  intensity: 5,
  note: "",
};

export function HealthBodyMap() {
  const [zones, setZones] = useState<ProblemZone[]>([]);
  const [mounted, setMounted] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);

  useEffect(() => {
    startTransition(() => {
      setZones(loadZones());
      setMounted(true);
    });
  }, []);

  function getActiveZone(key: string) {
    return zones.find((z) => z.zone === key) ?? null;
  }

  function openZone(key: string, label: string) {
    setSelectedKey(key);
    setSelectedLabel(label);
    const existing = getActiveZone(key);
    if (existing) {
      setForm({ type: existing.type, side: existing.side, intensity: existing.intensity, note: existing.note });
    } else {
      setForm(DEFAULT_FORM);
    }
  }

  function closeForm() {
    setSelectedKey(null);
    setSelectedLabel("");
  }

  function saveZone() {
    if (!selectedKey) return;
    const existing = getActiveZone(selectedKey);
    const updated: ProblemZone = {
      id: existing?.id ?? `${selectedKey}-${Date.now()}`,
      zone: selectedKey,
      label: selectedLabel,
      type: form.type,
      side: form.side,
      intensity: form.intensity,
      note: form.note,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    const next = [...zones.filter((z) => z.zone !== selectedKey), updated];
    setZones(next);
    persistZones(next);
    closeForm();
  }

  function removeZone(key: string) {
    const next = zones.filter((z) => z.zone !== key);
    setZones(next);
    persistZones(next);
    if (selectedKey === key) closeForm();
  }

  function setIntensity(delta: number) {
    setForm((f) => ({ ...f, intensity: Math.min(10, Math.max(1, f.intensity + delta)) }));
  }

  if (!mounted) {
    return (
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="h-64 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
        <div className="h-64 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
      {/* Zone grid */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/5 dark:bg-zinc-900/70">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Карта тела</h2>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Выберите зону, где есть боль, напряжение или дискомфорт.
          </p>
        </div>

        <div className="grid gap-5">
          {ZONE_AREAS.map(({ area, items }) => (
            <div key={area}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {area}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map(({ key, label }) => {
                  const active = getActiveZone(key);
                  const isSelected = selectedKey === key;
                  return (
                    <button
                      className={[
                        "inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all",
                        isSelected
                          ? "border-primary/40 bg-primary/10 text-primary ring-1 ring-primary/20"
                          : active
                          ? [
                              "ring-1",
                              intensityBgClass(active.intensity),
                              intensityRingClass(active.intensity),
                            ].join(" ")
                          : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 dark:border-white/8 dark:bg-white/4 dark:text-zinc-300 dark:hover:bg-white/8",
                      ].join(" ")}
                      key={key}
                      onClick={() => openZone(key, label)}
                      type="button"
                    >
                      {active ? (
                        <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                      ) : null}
                      {label}
                      {active ? (
                        <span className="text-xs font-semibold opacity-80">{active.intensity}</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>


      </div>

      {/* Right panel: form or zones list */}
      <div>
        {selectedKey ? (
          /* Zone form */
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/5 dark:bg-zinc-900/70">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                  {selectedLabel}
                </h3>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {getActiveZone(selectedKey) ? "Обновить зону" : "Добавить зону"}
                </p>
              </div>
              <button
                aria-label="Закрыть"
                className="grid h-8 w-8 place-items-center rounded-xl border border-zinc-200 text-zinc-500 hover:bg-zinc-100 dark:border-white/10 dark:hover:bg-white/5"
                onClick={closeForm}
                type="button"
              >
                <X size={14} />
              </button>
            </div>

            <div className="grid gap-4">
              {/* Type */}
              <div>
                <p className="mb-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">Тип</p>
                <div className="flex flex-wrap gap-2">
                  {ZONE_TYPES.map(({ value, label }) => (
                    <button
                      className={[
                        "rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors",
                        form.type === value
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-white/8 dark:bg-white/4 dark:text-zinc-400 dark:hover:bg-white/8",
                      ].join(" ")}
                      key={value}
                      onClick={() => setForm((f) => ({ ...f, type: value }))}
                      type="button"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Intensity */}
              <div>
                <p className="mb-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Интенсивность: {form.intensity} / 10
                </p>
                <div className="flex items-center gap-3">
                  <button
                    aria-label="Уменьшить"
                    className="grid h-8 w-8 place-items-center rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/5"
                    disabled={form.intensity <= 1}
                    onClick={() => setIntensity(-1)}
                    type="button"
                  >
                    <Minus size={14} />
                  </button>
                  <div className="flex flex-1 items-center gap-1">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <button
                        aria-label={`Интенсивность ${n}`}
                        className={[
                          "h-6 flex-1 rounded-sm transition-all",
                          n <= form.intensity
                            ? n <= 3
                              ? "bg-rose-300 dark:bg-rose-500/40"
                              : n <= 6
                              ? "bg-rose-400 dark:bg-rose-500/60"
                              : "bg-rose-500"
                            : "bg-zinc-200 dark:bg-zinc-700",
                        ].join(" ")}
                        key={n}
                        onClick={() => setForm((f) => ({ ...f, intensity: n }))}
                        type="button"
                      />
                    ))}
                  </div>
                  <button
                    aria-label="Увеличить"
                    className="grid h-8 w-8 place-items-center rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/5"
                    disabled={form.intensity >= 10}
                    onClick={() => setIntensity(1)}
                    type="button"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Side */}
              <div>
                <p className="mb-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">Сторона</p>
                <div className="flex flex-wrap gap-2">
                  {ZONE_SIDES.map(({ value, label }) => (
                    <button
                      className={[
                        "rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors",
                        form.side === value
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-white/8 dark:bg-white/4 dark:text-zinc-400 dark:hover:bg-white/8",
                      ].join(" ")}
                      key={value}
                      onClick={() => setForm((f) => ({ ...f, side: value }))}
                      type="button"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div>
                <label
                  className="mb-1.5 block text-xs font-semibold text-zinc-500 dark:text-zinc-400"
                  htmlFor="zone-note"
                >
                  Заметка
                </label>
                <textarea
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-950 placeholder-zinc-400 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-50 dark:placeholder-zinc-500"
                  id="zone-note"
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                  placeholder="После долгой работы за ноутбуком…"
                  rows={2}
                  value={form.note}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button className="flex-1" onClick={saveZone} type="button">
                  Сохранить зону
                </Button>
                {getActiveZone(selectedKey) ? (
                  <Button
                    className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/10"
                    onClick={() => removeZone(selectedKey)}
                    type="button"
                    variant="secondary"
                  >
                    Удалить
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          /* Active zones list */
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/5 dark:bg-zinc-900/70">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                Активные зоны
              </h3>
              {zones.length > 0 ? (
                <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
                  {zones.length}
                </span>
              ) : null}
            </div>

            {zones.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="grid h-11 w-11 place-items-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-white/8 dark:bg-white/4">
                  <MapPin aria-hidden="true" size={20} />
                </div>
                <p className="mt-3 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  Зоны не отмечены
                </p>
                <p className="mt-1 max-w-[200px] text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  Выберите участок тела на карте слева
                </p>
              </div>
            ) : (
              <div className="grid gap-2">
                {zones
                  .slice()
                  .sort((a, b) => b.intensity - a.intensity)
                  .map((zone) => (
                    <button
                      className="flex w-full items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-left transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-white/5 dark:bg-white/3 dark:hover:bg-white/6"
                      key={zone.id}
                      onClick={() => openZone(zone.zone, zone.label)}
                      type="button"
                    >
                      <div
                        className={[
                          "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold",
                          zone.intensity <= 3
                            ? "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300"
                            : zone.intensity <= 6
                            ? "bg-rose-200 text-rose-700 dark:bg-rose-500/25 dark:text-rose-200"
                            : "bg-rose-300 text-rose-800 dark:bg-rose-500/40 dark:text-rose-100",
                        ].join(" ")}
                      >
                        {zone.intensity}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                          {zone.label}
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                          {ZONE_TYPES.find((t) => t.value === zone.type)?.label ?? zone.type}
                          {zone.side !== "none"
                            ? ` · ${ZONE_SIDES.find((s) => s.value === zone.side)?.label ?? ""}`
                            : ""}
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                          {formatZoneDate(zone.updatedAt)}
                        </p>
                      </div>
                    </button>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Hint card */}
        <div className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/5 dark:bg-zinc-950/35">
          <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            Нажмите на зону тела, чтобы отметить дискомфорт. Данные сохраняются
            локально на устройстве.{" "}
            <Link
              className="font-semibold text-primary hover:underline"
              href="/health?view=overview"
            >
              Перейти в Обзор →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
