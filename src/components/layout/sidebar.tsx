"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { NavIcon } from "@/components/layout/nav-icon";
import { formatPlanTier } from "@/lib/domain/labels";
import {
  isNavigationActive,
  navigationItems,
} from "@/config/navigation";

type SidebarProps = {
  email: string | null;
  profile: {
    fullName: string | null;
    level: number;
    plan: string;
    preferredTheme: "system" | "light" | "dark";
    xpTotal: number;
  } | null;
};

const SIDEBAR_STORAGE_KEY = "lifera.sidebar.collapsed";
const SIDEBAR_STORAGE_EVENT = "lifera.sidebar.storage";

function subscribeSidebarStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(SIDEBAR_STORAGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SIDEBAR_STORAGE_EVENT, callback);
  };
}

function getSidebarSnapshot() {
  return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
}

function getSidebarServerSnapshot() {
  return false;
}

export function Sidebar({ email, profile }: SidebarProps) {
  const pathname = usePathname();
  const primaryItems = navigationItems.filter((item) => item.group !== "system");
  const systemItems = navigationItems.filter((item) => item.group === "system");
  const collapsed = useSyncExternalStore(
    subscribeSidebarStorage,
    getSidebarSnapshot,
    getSidebarServerSnapshot,
  );
  const displayName = profile?.fullName || email?.split("@")[0] || "Пользователь";
  const xpProgress = Math.min(100, Math.round(((profile?.xpTotal ?? 0) % 500) / 5));

  const groupedPrimary = primaryItems.reduce<
    Array<{ group: (typeof primaryItems)[number]["group"]; items: typeof primaryItems }>
  >((groups, item) => {
    const last = groups[groups.length - 1];
    if (last?.group === item.group) {
      last.items.push(item);
    } else {
      groups.push({ group: item.group, items: [item] });
    }
    return groups;
  }, []);

  function expandSidebar() {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, "false");
    window.dispatchEvent(new Event(SIDEBAR_STORAGE_EVENT));
  }

  function collapseSidebar() {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, "true");
    window.dispatchEvent(new Event(SIDEBAR_STORAGE_EVENT));
  }

  const visibleCollapsed = collapsed;

  useEffect(() => {
    document.documentElement.dataset.sidebar = visibleCollapsed ? "collapsed" : "expanded";
  }, [visibleCollapsed]);

  return (
    <aside
      className={[
        "sticky top-0 hidden h-screen shrink-0 overflow-y-auto border-r border-border bg-surface/95 px-2.5 py-3 backdrop-blur transition-[width] duration-200 md:flex md:flex-col",
        visibleCollapsed ? "w-[var(--sidebar-width-collapsed)]" : "w-[var(--sidebar-width)]",
      ].join(" ")}
      data-collapsed={visibleCollapsed}
    >
      {visibleCollapsed ? (
        <>
          <button
            aria-label="Открыть сайдбар"
            className="group mx-auto flex h-11 w-11 items-center justify-center rounded-[var(--radius-control)] transition-colors hover:bg-surface-muted hover:text-foreground"
            onClick={expandSidebar}
            title="Открыть сайдбар"
            type="button"
          >
            <span className="flex h-9 w-9 items-center justify-center group-hover:hidden">
              <Image
                alt="LIFERA mark"
                className="theme-logo-light h-6 w-auto"
                height={157}
                priority
                src="/brand/lifera-mark.svg"
                width={105}
              />
              <Image
                alt="LIFERA mark"
                className="theme-logo-dark h-6 w-auto"
                height={157}
                priority
                src="/brand/lifera-mark-dark.svg"
                width={105}
              />
            </span>
            <span className="hidden h-9 w-9 items-center justify-center text-muted-foreground transition-colors group-hover:flex group-hover:text-foreground">
              <PanelLeftOpen aria-hidden="true" size={20} strokeWidth={2.15} />
            </span>
          </button>
          <button
            aria-label="Развернуть сайдбар по краю"
            className="absolute inset-y-0 right-0 z-10 w-2 cursor-col-resize opacity-0"
            onClick={expandSidebar}
            title="Развернуть сайдбар по краю"
            type="button"
          />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3">
            <Link
              className="min-w-0 flex-1 rounded-[var(--radius-control)] px-2 py-2 transition-colors hover:bg-surface-muted"
              href="/"
              title="Lifera"
            >
              <span className="flex items-center">
                <Image
                  alt="LIFERA"
                  className="theme-logo-light h-6 w-auto"
                  height={157}
                  priority
                  src="/brand/lifera-logo.svg"
                  width={816}
                />
                <Image
                  alt="LIFERA"
                  className="theme-logo-dark h-6 w-auto"
                  height={157}
                  priority
                  src="/brand/lifera-wordmark-dark.svg"
                  width={816}
                />
              </span>
            </Link>
            <button
              aria-label="Свернуть сайдбар"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-control)] text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
              onClick={collapseSidebar}
              title="Свернуть сайдбар"
              type="button"
            >
              <PanelLeftClose aria-hidden="true" size={20} strokeWidth={2.15} />
            </button>
          </div>
          <button
            aria-label="Свернуть сайдбар по краю"
            className="absolute inset-y-0 right-0 z-10 w-2 cursor-col-resize opacity-0"
            onClick={collapseSidebar}
            title="Свернуть сайдбар по краю"
            type="button"
          />
        </>
      )}

      <nav
        className={[
          "mt-5 flex-1 space-y-1",
          visibleCollapsed ? "flex flex-col items-center" : "",
        ].join(" ")}
        aria-label="Основная навигация"
      >
        {groupedPrimary.map(({ group, items }) => (
          <div className={visibleCollapsed ? "grid gap-1" : "w-full"} key={group}>
            {items.map((item) => {
              const isActive = isNavigationActive(pathname, item.href);

              return (
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "relative flex items-center rounded-[var(--radius-control)] border text-sm font-medium transition-[background-color,border-color,box-shadow,color] duration-200",
                    visibleCollapsed
                      ? "h-11 w-11 justify-center px-0 py-0"
                      : "mb-0.5 gap-2.5 px-2.5 py-2",
                    isActive
                      ? "border-[color:var(--border-primary-subtle)] bg-[color-mix(in_srgb,var(--primary)_9%,var(--surface))] text-primary shadow-[var(--shadow-sm)]"
                      : "border-transparent text-muted-foreground hover:border-border hover:bg-surface-muted hover:text-foreground",
                  ].join(" ")}
                  href={item.href}
                  key={item.href}
                  title={visibleCollapsed ? item.label : undefined}
                >
                  <NavIcon name={item.icon} />
                  {!visibleCollapsed ? <span>{item.label}</span> : null}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div
        className={[
          "mt-3 space-y-1 border-t border-border pt-3",
          visibleCollapsed ? "flex flex-col items-center" : "",
        ].join(" ")}
      >
        {systemItems.map((item) => {
          const isActive = isNavigationActive(pathname, item.href);

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={[
                "relative flex items-center rounded-[var(--radius-control)] border text-sm font-medium transition-colors",
                visibleCollapsed
                  ? "h-11 w-11 justify-center px-0 py-0"
                  : "gap-2.5 px-2.5 py-2",
                isActive
                  ? "border-[color:var(--border-primary-subtle)] bg-[color-mix(in_srgb,var(--primary)_9%,var(--surface))] text-primary shadow-[var(--shadow-sm)]"
                  : "border-transparent text-muted-foreground hover:border-border hover:bg-surface-muted hover:text-foreground",
              ].join(" ")}
              href={item.href}
              key={item.href}
              title={visibleCollapsed ? item.label : undefined}
            >
              <NavIcon name={item.icon} />
              {!visibleCollapsed ? <span>{item.label}</span> : null}
            </Link>
          );
        })}

        {!visibleCollapsed ? (
          <div className="mt-3 rounded-[var(--radius-card)] border border-border bg-surface-muted/80 p-3">
            <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Уровень {profile?.level ?? 1} · {profile?.xpTotal ?? 0} опыта
            </p>
            <p className="text-xs text-[var(--text-tertiary)]">
              План {formatPlanTier(profile?.plan ?? "free")}
            </p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-background">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
