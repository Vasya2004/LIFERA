"use client";

import { useVaulteraTheme } from "@/hooks/useVaulteraTheme";

const OPTIONS: { value: "auto" | "light" | "dark"; label: string; hint: string }[] = [
  { value: "auto", label: "Как на устройстве", hint: "Следует системной теме macOS/браузера" },
  { value: "light", label: "Светлая", hint: "Всегда светлая тема" },
  { value: "dark", label: "Тёмная", hint: "Всегда тёмная тема" },
];

export default function SettingsPage() {
  const { pref, setPref } = useVaulteraTheme();

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Настройки</h1>

      <section className="rounded-2xl border p-4">
        <h2 className="mb-1 text-sm font-semibold">Тема VAULTERA</h2>
        <p className="mb-4 text-sm text-neutral-500">
          Применяется только к разделу VAULTERA — остальной интерфейс LIFERA всегда светлый.
        </p>

        <div className="flex flex-col gap-2">
          {OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
                pref === option.value ? "border-black bg-neutral-50" : "border-neutral-200 hover:bg-neutral-50"
              }`}
            >
              <input
                type="radio"
                name="vaultera-theme"
                value={option.value}
                checked={pref === option.value}
                onChange={() => setPref(option.value)}
                className="mt-1"
              />
              <span>
                <span className="block text-sm font-medium">{option.label}</span>
                <span className="block text-xs text-neutral-500">{option.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
