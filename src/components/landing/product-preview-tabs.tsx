"use client";

import { useState } from "react";

const previews = [
  {
    id: "dashboard",
    label: "Dashboard",
    title: "Command center",
    metrics: [
      { label: "Life Score", value: "74", accent: true },
      { label: "Level", value: "4" },
      { label: "XP", value: "1 820" },
    ],
    panel: "Активная привычка · +80 XP за завершение",
  },
  {
    id: "goals",
    label: "Goals",
    title: "Стратегические квесты",
    metrics: [
      { label: "Активные", value: "3" },
      { label: "Прогресс", value: "62%" },
      { label: "Сферы", value: "4" },
    ],
    panel: "Цель «Запуск Lifera» связана с привычкой на 7 дней",
  },
  {
    id: "missions",
    label: "Missions",
    title: "Привычки",
    metrics: [
      { label: "Активные", value: "2" },
      { label: "Шаги", value: "5" },
      { label: "XP pool", value: "400" },
    ],
    panel: "Регулярное действие: запланировано → выполнено → серия растёт",
  },
  {
    id: "skills",
    label: "Skills",
    title: "Навыки",
    metrics: [
      { label: "Hard", value: "4" },
      { label: "Soft", value: "3" },
      { label: "XP", value: "620" },
    ],
    panel: "Навыки растут через привычки и пункты развития",
  },
  {
    id: "ai",
    label: "AI",
    title: "Следующий шаг",
    metrics: [
      { label: "Контекст", value: "12" },
      { label: "Фокус", value: "Goal" },
      { label: "Шаг", value: "1" },
    ],
    panel: "Рекомендация: завершить активный шаг привычки сегодня",
    ai: true,
  },
] as const;

export function ProductPreviewTabs() {
  const [active, setActive] = useState<(typeof previews)[number]["id"]>("dashboard");
  const current = previews.find((item) => item.id === active) ?? previews[0];

  return (
    <div className="relative">
      <div
        aria-hidden
        className="landing-glow-orb pointer-events-none absolute left-1/2 top-1/3 h-[360px] w-[360px] -translate-x-1/2"
      />
      <div className="relative overflow-hidden rounded-[28px] border border-white/8 bg-[#0B0F14]/90 p-4 sm:p-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {previews.map((tab) => (
            <button
              className={[
                "rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors",
                active === tab.id
                  ? "border-[#FF6A2A]/40 bg-[#FF5A1F]/15 text-[#FF6A2A]"
                  : "border-white/8 bg-[#111418] text-[#9CA3AF] hover:text-[#F5F5F2]",
              ].join(" ")}
              key={tab.id}
              onClick={() => setActive(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="rounded-[20px] border border-white/8 bg-[#111418] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6B7280]">
              {current.title}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {current.metrics.map((metric) => (
                <div
                  className={[
                    "rounded-[14px] border p-4",
                    "accent" in metric && metric.accent
                      ? "border-[#FF6A2A]/35 bg-[#FF5A1F]/10"
                      : "border-white/8 bg-[#151A20]",
                  ].join(" ")}
                  key={metric.label}
                >
                  <p className="text-[10px] uppercase tracking-wider text-[#6B7280]">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-xl font-semibold text-[#F5F5F2]">{metric.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#1A2028]">
              <div className="h-full w-[58%] rounded-full bg-gradient-to-r from-[#FF5A1F] to-[#F97316]" />
            </div>
          </div>

          <div
            className={[
              "rounded-[20px] border p-5",
              current.id === "ai"
                ? "border-[rgb(139_92_246/0.3)] bg-gradient-to-b from-[rgb(139_92_246/0.12)] to-[#111418]"
                : "border-white/8 bg-[#111418]",
            ].join(" ")}
          >
            <p
              className={[
                "text-[10px] font-semibold uppercase tracking-[0.16em]",
                current.id === "ai" ? "text-violet-300" : "text-[#FF6A2A]",
              ].join(" ")}
            >
              {current.id === "ai" ? "AI insight" : "Focus"}
            </p>
            <p className="mt-3 text-sm leading-6 text-[#9CA3AF]">{current.panel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
