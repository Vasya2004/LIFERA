"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

import { DashboardExportButton } from "@/components/dashboard/dashboard-export-button";
import { usePageActions } from "@/components/layout/page-actions";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { TopSectionTabs } from "@/components/layout/top-section-tabs";
import { UserMenu } from "@/components/layout/user-menu";
import { navigationItems } from "@/config/navigation";
import { getSectionTabs } from "@/config/section-tabs";

type TopbarProps = {
  email: string | null;
  profile: {
    fullName: string | null;
    level: number;
    plan: string;
    preferredTheme: "system" | "light" | "dark";
    xpTotal: number;
  } | null;
};

const advancedSectionLabels: Record<string, string> = {
  "/challenges": "План цели",
  "/skills": "Навыки",
};

export function Topbar({ email, profile }: TopbarProps) {
  const pathname = usePathname();
  const currentSection = navigationItems.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  const advancedSectionEntry = Object.entries(advancedSectionLabels).find(
    ([href]) => pathname === href || pathname.startsWith(`${href}/`),
  );
  const advancedSectionLabel = advancedSectionEntry?.[1];
  const sectionLabel = currentSection?.label ?? advancedSectionLabel ?? "Lifera";
  const isDashboard = pathname === "/dashboard";
  const pageActions = usePageActions();
  const hasSectionTabs = getSectionTabs(pathname).length > 0;
  const actions = pageActions ?? (isDashboard ? <DashboardExportButton /> : null);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-xl">
        <div className="flex w-full min-w-0 items-center justify-between gap-3 px-[var(--app-content-gutter)] py-3">
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {sectionLabel}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle initialTheme={profile?.preferredTheme ?? "system"} />
            <button
              aria-disabled="true"
              aria-label="Уведомления скоро"
              className="hidden h-[54px] w-[54px] items-center justify-center rounded-full border border-border bg-surface-muted/70 text-muted-foreground shadow-[var(--shadow-sm)] backdrop-blur-xl transition-colors hover:border-border-strong hover:bg-surface hover:text-foreground sm:inline-flex"
              title="Уведомления появятся позже"
              type="button"
            >
              <Bell aria-hidden="true" size={18} strokeWidth={2.15} />
            </button>
            <UserMenu email={email} fullName={profile?.fullName ?? null} />
          </div>
        </div>
      </header>
      {hasSectionTabs || actions ? (
        <div className="app-page pt-6">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <TopSectionTabs />
            {actions ? (
              <div className="flex min-w-0 shrink-0">
                {actions}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
