"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { NavIcon } from "@/components/layout/nav-icon";
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

export function Sidebar({ email, profile }: SidebarProps) {
  const pathname = usePathname();
  const primaryItems = navigationItems.filter((item) => item.group !== "system");
  const systemItems = navigationItems.filter((item) => item.group === "system");
  const displayName = profile?.fullName || email?.split("@")[0] || "Lifera user";
  const xpProgress = Math.min(100, Math.round(((profile?.xpTotal ?? 0) % 500) / 5));

  return (
    <aside className="sticky top-0 hidden h-screen w-[var(--sidebar-width)] shrink-0 overflow-y-auto border-r border-border bg-surface px-3 py-4 md:flex md:flex-col">
      <Link
        className="block rounded-[var(--radius-control)] px-2 py-2 transition-colors hover:bg-surface-muted"
        href="/"
      >
        <span className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-control)] border border-border bg-surface-muted">
            <Image
              alt="LIFERA mark"
              className="h-5 w-auto dark:invert"
              height={157}
              priority
              src="/brand/lifera-mark.svg"
              width={105}
            />
          </span>
          <Image
            alt="LIFERA"
            className="h-5 w-auto dark:invert"
            height={145}
            priority
            src="/brand/lifera-wordmark.svg"
            width={661}
          />
        </span>
      </Link>

      <nav className="mt-6 flex-1 space-y-0.5" aria-label="Основная навигация">
        {primaryItems.map((item) => {
          const isActive = isNavigationActive(pathname, item.href);

          return (
            <Link
              className={[
                "flex items-center gap-2.5 rounded-[var(--radius-control)] border px-2.5 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-[color:var(--border-primary-subtle)] bg-[color-mix(in_srgb,var(--primary)_7%,var(--surface))] text-primary"
                  : "border-transparent text-muted-foreground hover:border-border hover:bg-surface-muted hover:text-foreground",
              ].join(" ")}
              href={item.href}
              key={item.href}
            >
              <NavIcon name={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 space-y-0.5 border-t border-border pt-3">
        {systemItems.map((item) => {
          const isActive = isNavigationActive(pathname, item.href);

          return (
            <Link
              className={[
                "flex items-center gap-2.5 rounded-[var(--radius-control)] border px-2.5 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-[color:var(--border-primary-subtle)] bg-[color-mix(in_srgb,var(--primary)_7%,var(--surface))] text-primary"
                  : "border-transparent text-muted-foreground hover:border-border hover:bg-surface-muted hover:text-foreground",
              ].join(" ")}
              href={item.href}
              key={item.href}
            >
              <NavIcon name={item.icon} />
              {item.label}
            </Link>
          );
        })}

        <div className="mt-3 rounded-[var(--radius-card)] border border-border bg-surface-muted p-3">
          <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Lv {profile?.level ?? 1} · {profile?.xpTotal ?? 0} XP ·{" "}
            {(profile?.plan ?? "free").toUpperCase()}
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-background">
            <div className="h-full rounded-full bg-success" style={{ width: `${xpProgress}%` }} />
          </div>
        </div>
      </div>
    </aside>
  );
}
