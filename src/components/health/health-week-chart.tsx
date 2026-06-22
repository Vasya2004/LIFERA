"use client";

import { useState } from "react";

import type { HealthSnapshot } from "@/lib/domain/health";

type HealthWeekChartProps = {
  history: HealthSnapshot[];
  title?: string;
};

const DAYS_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export function HealthWeekChart({ history, title = "Динамика" }: HealthWeekChartProps) {
  const [tooltip, setTooltip] = useState<{ index: number; x: number; y: number } | null>(null);

  const entries = history.slice(0, 7).reverse();
  const hasEnoughData = entries.length >= 2;

  const energyData = entries.map((e) => e.energy_level * 10);
  const sleepData = entries.map((e) => Math.round((e.sleep_hours / 8) * 100));
  const recoveryData = entries.map((e) => e.recovery_score * 10);
  const stressData = entries.map((e) => Math.max(0, 100 - e.recovery_score * 10));

  const chartW = 560;
  const chartH = 160;
  const padL = 36;
  const padR = 16;
  const padT = 8;
  const padB = 28;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;

  function toPath(data: number[]) {
    if (data.length < 2) return "";
    return data
      .map((v, i) => {
        const x = padL + (i / (data.length - 1)) * innerW;
        const y = padT + innerH - (v / 100) * innerH;
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
  }

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!hasEnoughData) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const idx = Math.round(((relX - padL) / innerW) * (entries.length - 1));
    if (idx >= 0 && idx < entries.length) {
      setTooltip({ index: idx, x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }

  const tickValues = [0, 25, 50, 75, 100];

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/5 dark:bg-zinc-900/70">
      <h2 className="mb-3 text-base font-semibold text-zinc-950 dark:text-zinc-50">{title}</h2>

      <div className="mb-3 flex flex-wrap gap-4 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-4 rounded-full bg-blue-400" />
          Сон
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-4 rounded-full bg-amber-400" />
          Энергия
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-4 rounded-full bg-green-400" />
          Восстановление
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-4 rounded-full bg-rose-400" />
          Стресс
        </span>
      </div>

      {hasEnoughData ? (
        <div className="relative">
          <svg
            className="w-full"
            onMouseLeave={() => setTooltip(null)}
            onMouseMove={handleMouseMove}
            viewBox={`0 0 ${chartW} ${chartH}`}
          >
            {tickValues.map((v) => {
              const y = padT + innerH - (v / 100) * innerH;
              return (
                <g key={v}>
                  <line
                    className="stroke-zinc-100 dark:stroke-zinc-800"
                    strokeWidth="1"
                    x1={padL}
                    x2={chartW - padR}
                    y1={y}
                    y2={y}
                  />
                  <text
                    className="fill-zinc-400 dark:fill-zinc-600"
                    fontSize="10"
                    textAnchor="end"
                    x={padL - 6}
                    y={y + 3}
                  >
                    {v}
                  </text>
                </g>
              );
            })}

            {entries.map((_, i) => {
              const x = padL + (i / (entries.length - 1)) * innerW;
              return (
                <text
                  className="fill-zinc-400 dark:fill-zinc-600"
                  fontSize="10"
                  key={i}
                  textAnchor="middle"
                  x={x}
                  y={chartH - 6}
                >
                  {DAYS_RU[i] ?? ""}
                </text>
              );
            })}

            <path d={toPath(sleepData)} fill="none" stroke="#60a5fa" strokeWidth="1.5" />
            <path d={toPath(energyData)} fill="none" stroke="#fbbf24" strokeWidth="1.5" />
            <path d={toPath(recoveryData)} fill="none" stroke="#4ade80" strokeWidth="1.5" />
            <path d={toPath(stressData)} fill="none" stroke="#fb7185" strokeWidth="1.5" />
          </svg>

          {tooltip ? (
            <div
              className="pointer-events-none absolute z-10 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-white/10 dark:bg-zinc-950"
              style={{ left: tooltip.x + 8, top: tooltip.y - 40 }}
            >
              <div className="mb-1 font-semibold text-zinc-950 dark:text-zinc-50">
                {DAYS_RU[tooltip.index] ?? ""} {entries[tooltip.index]?.date?.slice(5) ?? ""}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-zinc-500 dark:text-zinc-400">
                <span>Сон:</span>
                <span className="text-zinc-950 dark:text-zinc-50">
                  {sleepData[tooltip.index] ?? 0}
                </span>
                <span>Энергия:</span>
                <span className="text-zinc-950 dark:text-zinc-50">
                  {energyData[tooltip.index] ?? 0}
                </span>
                <span>Восстановление:</span>
                <span className="text-zinc-950 dark:text-zinc-50">
                  {recoveryData[tooltip.index] ?? 0}
                </span>
                <span>Стресс:</span>
                <span className="text-zinc-950 dark:text-zinc-50">
                  {stressData[tooltip.index] ?? 0}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700">
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            Добавьте несколько записей для динамики
          </p>
        </div>
      )}
    </div>
  );
}
