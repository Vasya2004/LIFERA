"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

import { NavIcon } from "@/components/layout/nav-icon";
import { getSectionTabs } from "@/config/section-tabs";

const queryViewRoutes: Record<string, Set<string>> = {
  "/achievements": new Set(["all", "personal", "system"]),
  "/dashboard": new Set(["overview", "focus", "progress"]),
  "/finance": new Set(["overview", "history"]),
  "/habits": new Set(["today", "missions"]),
  "/health": new Set(["overview", "body-map", "history"]),
  "/skills": new Set(["focus", "all"]),
};

const queryViewAliases: Record<string, Record<string, string>> = {
  "/habits": {
    all: "missions",
    archive: "missions",
    rhythm: "today",
  },
  "/achievements": {
    archive: "all",
    "in-progress": "all",
    progress: "all",
  },
  "/health": {
    checkin: "overview",
    dynamics: "overview",
    week: "overview",
    weekly: "overview",
    "body-map": "body-map",
  },
  "/finance": {
    dynamics: "overview",
    goal: "overview",
    goals: "overview",
    snapshots: "history",
  },
  "/skills": {
    active: "all",
    archive: "all",
    development: "focus",
  },
};

export function TopSectionTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabs = getSectionTabs(pathname);
  const [selectedByPath, setSelectedByPath] = useState<Record<string, string>>({});
  const selectedHref = selectedByPath[pathname];
  const viewParam = searchParams.get("view");
  const validViews = queryViewRoutes[pathname];
  const normalizedViewParam =
    viewParam && queryViewAliases[pathname]?.[viewParam]
      ? queryViewAliases[pathname][viewParam]
      : viewParam;
  const queryViewHref =
    validViews && normalizedViewParam && validViews.has(normalizedViewParam)
      ? `?view=${normalizedViewParam}`
      : validViews
      ? `?view=${[...validViews][0]}`
      : null;
  const routeActiveHref =
    queryViewHref ??
    tabs.find((tab) => tab.href.startsWith("/") && pathname === tab.href)?.href ??
    null;
  const activeHref = routeActiveHref
    ? routeActiveHref
    : tabs.some((tab) => tab.href === selectedHref)
    ? selectedHref
    : tabs[0]?.href ?? null;

  if (tabs.length === 0) {
    return null;
  }

  function selectTab(href: string) {
    setSelectedByPath((current) => ({ ...current, [pathname]: href }));
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${href}`);
  }

  return (
    <nav
      aria-label="Подменю текущего раздела"
      className="min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div
        className="inline-flex h-11 min-w-max items-center gap-1 rounded-2xl border border-border bg-surface-muted/70 p-1 shadow-[var(--shadow-sm)] backdrop-blur-xl"
        role="tablist"
      >
        {tabs.map((tab) => {
          const active = activeHref === tab.href;
          const className = [
            "inline-flex h-9 items-center gap-2 rounded-xl px-3.5 text-sm font-semibold transition-[background-color,color,box-shadow]",
            active
              ? "bg-foreground text-background shadow-[var(--shadow-sm)]"
              : "text-muted-foreground hover:bg-surface hover:text-foreground",
          ].join(" ");
          const content = (
            <>
              <span className="h-4 w-4 [&>svg]:h-4 [&>svg]:w-4">
                <NavIcon name={tab.icon} />
              </span>
              {tab.label}
            </>
          );

          if (tab.href.startsWith("/") || tab.href.startsWith("?")) {
            return (
              <Link
                aria-current={active ? "page" : undefined}
                aria-selected={active}
                className={className}
                href={tab.href.startsWith("?") ? `${pathname}${tab.href}` : tab.href}
                key={`${tab.href}-${tab.label}`}
                role="tab"
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              aria-current={active ? "page" : undefined}
              aria-selected={active}
              className={className}
              key={`${tab.href}-${tab.label}`}
              onClick={() => selectTab(tab.href)}
              role="tab"
              type="button"
            >
              {content}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
