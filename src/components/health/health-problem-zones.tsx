"use client";

import { startTransition, useEffect, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";

import type { ProblemZone } from "@/components/health/health-body-map";
import { STORAGE_KEY } from "@/components/health/health-body-map";



function intensityDotClass(intensity: number) {
  if (intensity <= 3) return "bg-rose-400 dark:bg-rose-500/50";
  if (intensity <= 6) return "bg-rose-500 dark:bg-rose-500/70";
  return "bg-rose-600 dark:bg-rose-500";
}

export function HealthProblemZones() {
  const [zones, setZones] = useState<ProblemZone[] | null>(null);

  useEffect(() => {
    startTransition(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        setZones(stored ? (JSON.parse(stored) as ProblemZone[]) : []);
      } catch {
        setZones([]);
      }
    });
  }, []);

  if (zones === null) return null;
  if (zones.length === 0) return null;

  const sorted = zones.slice().sort((a, b) => b.intensity - a.intensity).slice(0, 5);

  return (
    <section className="rounded-2xl border border-rose-200/70 bg-rose-50/30 p-5 dark:border-rose-500/20 dark:bg-zinc-900/70">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl border border-rose-100 bg-rose-50 text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
            <MapPin aria-hidden="true" size={15} />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Проблемные зоны
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {zones.length} {zones.length === 1 ? "зона" : zones.length <= 4 ? "зоны" : "зон"} отмечено
            </p>
          </div>
        </div>
        <Link
          className="inline-flex h-7 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:bg-transparent dark:text-zinc-300 dark:hover:bg-zinc-800"
          href="/health?view=body-map"
        >
          Карта тела
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {sorted.map((zone) => (
          <Link
            className="inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 transition-colors hover:border-rose-200 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:border-rose-500/30"
            href="/health?view=body-map"
            key={zone.id}
          >
            <span className={["h-1.5 w-1.5 rounded-full", intensityDotClass(zone.intensity)].join(" ")} />
            <span>{zone.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
