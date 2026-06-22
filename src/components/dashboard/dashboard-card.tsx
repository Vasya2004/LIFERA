import type { ReactNode } from "react";

export type DashboardAccentKey =
  | "brand"
  | "missions"
  | "finance"
  | "health"
  | "achievements"
  | "recommendation";

type DashboardAccent = {
  bg: string;
  border: string;
  buttonGhost: string;
  glow: string;
  line: string;
  progress: string;
  text: string;
};

export const dashboardAccents: Record<DashboardAccentKey, DashboardAccent> = {
  achievements: {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-amber-200 dark:border-amber-500/20",
    buttonGhost: "hover:bg-amber-50 focus-visible:ring-amber-500/30 dark:hover:bg-amber-500/10 dark:focus-visible:ring-amber-400/30",
    glow: "bg-amber-200/35 dark:bg-amber-500/10",
    line: "from-amber-500/45 via-amber-300/20 to-transparent dark:from-amber-400/55 dark:via-amber-400/15 dark:to-transparent",
    progress: "bg-amber-600 dark:bg-amber-400",
    text: "text-amber-700 dark:text-amber-400",
  },
  brand: {
    bg: "bg-orange-50 dark:bg-[#FF5A1F]/10",
    border: "border-orange-200 dark:border-[#FF5A1F]/20",
    buttonGhost: "hover:bg-orange-50 focus-visible:ring-orange-500/30 dark:hover:bg-[#FF5A1F]/10 dark:focus-visible:ring-[#FF5A1F]/35",
    glow: "bg-orange-200/35 dark:bg-[#FF5A1F]/10",
    line: "from-orange-500/45 via-orange-300/20 to-transparent dark:from-[#FF5A1F]/60 dark:via-[#FF5A1F]/20 dark:to-transparent",
    progress: "bg-orange-600 dark:bg-[#FF5A1F]",
    text: "text-orange-700 dark:text-[#FF5A1F]",
  },
  finance: {
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-200 dark:border-emerald-500/20",
    buttonGhost: "hover:bg-emerald-50 focus-visible:ring-emerald-500/30 dark:hover:bg-emerald-500/10 dark:focus-visible:ring-emerald-400/30",
    glow: "bg-emerald-200/35 dark:bg-emerald-500/10",
    line: "from-emerald-500/45 via-emerald-300/20 to-transparent dark:from-emerald-400/50 dark:via-emerald-400/15 dark:to-transparent",
    progress: "bg-emerald-600 dark:bg-emerald-400",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  health: {
    bg: "bg-rose-50 dark:bg-rose-500/10",
    border: "border-rose-200 dark:border-rose-500/20",
    buttonGhost: "hover:bg-rose-50 focus-visible:ring-rose-500/30 dark:hover:bg-rose-500/10 dark:focus-visible:ring-rose-400/30",
    glow: "bg-rose-200/35 dark:bg-rose-500/10",
    line: "from-rose-500/45 via-rose-300/20 to-transparent dark:from-rose-400/50 dark:via-rose-400/15 dark:to-transparent",
    progress: "bg-rose-600 dark:bg-rose-400",
    text: "text-rose-700 dark:text-rose-400",
  },
  missions: {
    bg: "bg-blue-50 dark:bg-blue-500/10",
    border: "border-blue-200 dark:border-blue-500/20",
    buttonGhost: "hover:bg-blue-50 focus-visible:ring-blue-500/30 dark:hover:bg-blue-500/10 dark:focus-visible:ring-blue-400/30",
    glow: "bg-blue-200/35 dark:bg-blue-500/10",
    line: "from-blue-500/45 via-blue-300/20 to-transparent dark:from-blue-400/50 dark:via-blue-400/15 dark:to-transparent",
    progress: "bg-blue-600 dark:bg-blue-400",
    text: "text-blue-700 dark:text-blue-400",
  },
  recommendation: {
    bg: "bg-violet-50 dark:bg-violet-500/10",
    border: "border-violet-200 dark:border-violet-500/20",
    buttonGhost: "hover:bg-violet-50 focus-visible:ring-violet-500/30 dark:hover:bg-violet-500/10 dark:focus-visible:ring-violet-400/30",
    glow: "bg-violet-200/35 dark:bg-violet-500/10",
    line: "from-violet-500/45 via-violet-300/20 to-transparent dark:from-violet-400/50 dark:via-violet-400/15 dark:to-transparent",
    progress: "bg-violet-600 dark:bg-violet-400",
    text: "text-violet-700 dark:text-violet-400",
  },
};

export function dashboardGhostButtonClass(accent: DashboardAccentKey) {
  return [
    "border-zinc-200 bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
    "dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10",
    "focus-visible:ring-2",
    dashboardAccents[accent].buttonGhost,
  ].join(" ");
}

export function DashboardCard({
  accent,
  children,
  className = "",
}: {
  accent?: DashboardAccentKey;
  children: ReactNode;
  className?: string;
}) {
  const accentClasses = accent ? dashboardAccents[accent] : null;

  return (
    <div
      className={[
        "relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 text-zinc-950 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-colors dark:border-white/5 dark:bg-zinc-900/70 dark:text-zinc-50",
        className,
      ].join(" ")}
    >
      {accentClasses ? (
        <>
          <div className={["pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r", accentClasses.line].join(" ")} />
          <div className={["pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl opacity-40 dark:opacity-70", accentClasses.glow].join(" ")} />
        </>
      ) : null}
      {children}
    </div>
  );
}

export function DashboardCardHeader({
  action,
  accent,
  icon,
  title,
}: {
  accent?: DashboardAccentKey;
  action?: ReactNode;
  icon: ReactNode;
  title: string;
}) {
  const accentClasses = accent ? dashboardAccents[accent] : null;

  return (
    <div className="relative flex min-h-8 items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={[
            "grid h-8 w-8 shrink-0 place-items-center rounded-xl border [&>svg]:h-5 [&>svg]:w-5",
            accentClasses
              ? [accentClasses.border, accentClasses.bg, accentClasses.text].join(" ")
              : "border-zinc-200 bg-zinc-100 text-zinc-500 dark:border-white/10 dark:bg-zinc-950/45 dark:text-zinc-400",
          ].join(" ")}
        >
          {icon}
        </span>
        <h3 className="truncate text-base font-semibold text-zinc-950 dark:text-zinc-50">{title}</h3>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function DashboardEmptyState({
  accent,
  action,
  description,
  icon,
  title,
}: {
  accent?: DashboardAccentKey;
  action?: ReactNode;
  description: string;
  icon: ReactNode;
  title: string;
}) {
  const accentClasses = accent ? dashboardAccents[accent] : null;

  return (
    <div className="relative grid flex-1 place-items-center py-5 text-center">
      <div className="max-w-sm">
        <div
          className={[
            "mx-auto grid h-12 w-12 place-items-center rounded-2xl border [&>svg]:h-8 [&>svg]:w-8",
            accentClasses
              ? [accentClasses.border, accentClasses.bg, accentClasses.text].join(" ")
              : "border-zinc-200 bg-zinc-100 text-zinc-500 dark:border-white/5 dark:bg-zinc-950/35 dark:text-zinc-500",
          ].join(" ")}
        >
          {icon}
        </div>
        <p className="mt-4 text-base font-semibold text-zinc-950 dark:text-zinc-50">{title}</p>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{description}</p>
        {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
      </div>
    </div>
  );
}

export function DashboardProgressBar({
  accent = "brand",
  value,
}: {
  accent?: DashboardAccentKey;
  value: number;
}) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
      <div
        className={["h-full rounded-full", dashboardAccents[accent].progress].join(" ")}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function DashboardMetricRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-4 text-sm">
      <span className="min-w-0 text-zinc-600 dark:text-zinc-400">{label}</span>
      <span className="shrink-0 font-semibold text-zinc-950 dark:text-zinc-50">{value}</span>
    </div>
  );
}
