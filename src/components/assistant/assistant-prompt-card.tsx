"use client";

import type { ComponentType } from "react";
import { ArrowUpRight } from "lucide-react";

type AssistantPromptCardProps = {
  accent: "brand" | "finance" | "health" | "achievement";
  description: string;
  icon: ComponentType<{ className?: string; size?: number }>;
  onClick: () => void;
  prompt: string;
  title: string;
};

const accentClasses: Record<AssistantPromptCardProps["accent"], {
  badge: string;
  glow: string;
  gradient: string;
  icon: string;
  ring: string;
}> = {
  achievement: {
    badge: "bg-[#FF5A1F]/12 text-[#FF5A1F] dark:bg-[#FF5A1F]/15",
    glow: "bg-[#FF5A1F]/25",
    gradient: "from-[#FF5A1F]/28 via-[#FF5A1F]/10 to-transparent",
    icon: "text-[#FF5A1F]",
    ring: "group-hover:border-[#FF5A1F]/35 focus-visible:ring-[#FF5A1F]/35",
  },
  brand: {
    badge: "bg-[#FF5A1F]/12 text-[#FF5A1F] dark:bg-[#FF5A1F]/15",
    glow: "bg-[#FF5A1F]/25",
    gradient: "from-[#FF5A1F]/35 via-[#FF5A1F]/12 to-transparent",
    icon: "text-[#FF5A1F]",
    ring: "group-hover:border-[#FF5A1F]/35 focus-visible:ring-[#FF5A1F]/35",
  },
  finance: {
    badge: "bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    glow: "bg-emerald-500/22",
    gradient: "from-emerald-500/30 via-emerald-500/10 to-transparent",
    icon: "text-emerald-500 dark:text-emerald-400",
    ring: "group-hover:border-emerald-500/35 focus-visible:ring-emerald-500/35",
  },
  health: {
    badge: "bg-rose-500/12 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
    glow: "bg-rose-500/22",
    gradient: "from-rose-500/30 via-rose-500/10 to-transparent",
    icon: "text-rose-500 dark:text-rose-400",
    ring: "group-hover:border-rose-500/35 focus-visible:ring-rose-500/35",
  },
};

export function AssistantPromptCard({
  accent,
  description,
  icon: Icon,
  onClick,
  prompt,
  title,
}: AssistantPromptCardProps) {
  const classes = accentClasses[accent];

  return (
    <button
      aria-label={`${title}: ${prompt}`}
      className={[
        "group relative min-h-[150px] overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-[var(--shadow-sm)] outline-none transition duration-300 ease-out hover:-translate-y-1 hover:scale-[1.015] hover:shadow-[0_18px_46px_rgba(9,9,11,0.18)] focus-visible:ring-2 dark:border-white/5 dark:bg-zinc-900/70 dark:shadow-none dark:hover:shadow-[0_18px_54px_rgba(0,0,0,0.36)] xl:min-h-[160px]",
        classes.ring,
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      <span
        aria-hidden="true"
        className={[
          "absolute inset-0 bg-gradient-to-br opacity-90 transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100",
          classes.gradient,
        ].join(" ")}
      />
      <span
        aria-hidden="true"
        className={[
          "absolute -right-10 -top-10 size-28 rounded-full blur-3xl opacity-45 transition duration-300 group-hover:scale-125 group-hover:opacity-70",
          classes.glow,
        ].join(" ")}
      />
      <span className="relative z-10 flex h-full flex-col">
        <span className="mb-8 flex items-start justify-between gap-4">
          <span
            className={[
              "grid size-11 place-items-center rounded-2xl border border-zinc-200/70 bg-white/80 shadow-[var(--shadow-sm)] transition duration-300 group-hover:scale-105 dark:border-white/10 dark:bg-zinc-950/70",
              classes.icon,
            ].join(" ")}
          >
            <Icon size={20} />
          </span>
          <span
            className={[
              "grid size-9 place-items-center rounded-full transition duration-300 group-hover:scale-110",
              classes.badge,
            ].join(" ")}
          >
            <ArrowUpRight size={16} />
          </span>
        </span>
        <span className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
          {title}
        </span>
        <span className="mt-2 text-sm leading-5 text-zinc-600 dark:text-zinc-400">
          {description}
        </span>
      </span>
    </button>
  );
}
