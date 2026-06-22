"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Download } from "lucide-react";

type DashboardView = "overview" | "focus" | "progress";

type DashboardViewModel = {
  achievementsSummary: unknown;
  activeMissions: unknown[];
  financeSummary: unknown;
  healthSummary: unknown;
  liferaRecommendation: unknown;
  mainWish: unknown;
  nextMission: unknown;
  primaryGoal: unknown;
  progressSummary: unknown;
  streak: number;
  userLevel: number;
  xp: number;
};

type DashboardExportPayload = {
  currentView: DashboardView;
  dashboardViewModel: DashboardViewModel;
  exportedAt: string;
};

const emptyRecommendation = {
  action: { href: "/goals", label: "Создать цель", reason: "empty_export" },
  content: "Данные dashboard пока недоступны для экспорта.",
  title: "Нет данных",
};

function normalizeNumber(value: unknown, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function parseDashboardView(view: string | null): DashboardView {
  return view === "focus" || view === "progress" || view === "overview" ? view : "overview";
}

function buildViewModel(dashboard: Record<string, unknown> | null): DashboardViewModel {
  const profile = dashboard?.profile as Record<string, unknown> | null | undefined;
  const activeHabits = Array.isArray(dashboard?.activeHabits) ? dashboard.activeHabits : [];
  const activeMissions = Array.isArray(dashboard?.activeMissions)
    ? dashboard.activeMissions
    : Array.isArray(dashboard?.todayMissions)
    ? dashboard.todayMissions
    : [];
  const streak = activeHabits.reduce((max, habit) => {
    if (!habit || typeof habit !== "object") {
      return max;
    }

    return Math.max(max, normalizeNumber((habit as Record<string, unknown>).streak_current));
  }, 0);
  const userLevel = normalizeNumber(dashboard?.userLevel ?? profile?.level, 1);
  const xp = normalizeNumber(dashboard?.xp ?? profile?.xp_total);
  const achievementsSummary = dashboard?.achievementsSummary ?? {
    nextTitle: null,
    progress: 0,
    total: 0,
    unlocked: 0,
  };

  return {
    achievementsSummary,
    activeMissions,
    financeSummary: dashboard?.financeSummary ?? { state: "empty" },
    healthSummary: dashboard?.healthSummary ?? { state: "empty" },
    liferaRecommendation: dashboard?.liferaRecommendation ?? emptyRecommendation,
    mainWish: dashboard?.mainWish ?? null,
    nextMission: dashboard?.nextMission ?? activeMissions[0] ?? null,
    primaryGoal: dashboard?.primaryGoal ?? null,
    progressSummary: dashboard?.progressSummary ?? {
      completedMissions: 0,
      goalProgress: 0,
      hasMovement: false,
      level: userLevel,
      streak,
      unlockedAchievements:
        typeof achievementsSummary === "object" &&
        achievementsSummary &&
        "unlocked" in achievementsSummary
          ? (achievementsSummary as { unlocked?: unknown }).unlocked
          : 0,
      xp,
    },
    streak: normalizeNumber(dashboard?.streak, streak),
    userLevel,
    xp,
  };
}

function buildExportPayload(
  currentView: DashboardView,
  dashboard: Record<string, unknown> | null,
): DashboardExportPayload {
  return {
    currentView,
    dashboardViewModel: buildViewModel(dashboard),
    exportedAt: new Date().toISOString(),
  };
}

function downloadJson(payload: DashboardExportPayload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `lifera-dashboard-${payload.currentView}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function DashboardExportButton() {
  const searchParams = useSearchParams();
  const [isExporting, setIsExporting] = useState(false);
  const currentView = parseDashboardView(searchParams.get("view"));

  async function handleExport() {
    if (isExporting) {
      return;
    }

    setIsExporting(true);

    try {
      const response = await fetch("/api/dashboard", { cache: "no-store" });
      const payload = response.ok ? await response.json() : null;
      const dashboard =
        payload && typeof payload === "object" && "dashboard" in payload
          ? ((payload as { dashboard?: unknown }).dashboard as Record<string, unknown> | null)
          : null;

      downloadJson(buildExportPayload(currentView, dashboard));
    } catch {
      downloadJson(buildExportPayload(currentView, null));
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <button
      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#FF5A1F] px-4 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,90,31,0.22)] transition-[filter,box-shadow,transform] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A1F]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px active:brightness-95 disabled:cursor-wait disabled:opacity-80 sm:w-auto"
      disabled={isExporting}
      onClick={handleExport}
      type="button"
    >
      <Download aria-hidden="true" size={17} strokeWidth={2.2} />
      {isExporting ? "Экспорт..." : "Экспорт"}
    </button>
  );
}
