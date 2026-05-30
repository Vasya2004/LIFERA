"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { navigationItems } from "@/config/navigation";

type TopbarProps = {
  profile: {
    fullName: string | null;
    level: number;
    plan: string;
    preferredTheme: "system" | "light" | "dark";
    xpTotal: number;
  } | null;
};

export function Topbar({ profile }: TopbarProps) {
  const pathname = usePathname();
  const currentSection = navigationItems.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  return (
    <header className="sticky top-0 z-20 min-h-[var(--topbar-height)] border-b border-border bg-surface/90 px-5 py-4 backdrop-blur sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            Фокус, прогресс и ближайшие действия
          </p>
          <p className="mt-1 truncate text-lg font-semibold tracking-tight text-foreground">
            {currentSection?.label ?? "Workspace"}
          </p>
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
          <p
            aria-disabled="true"
            className="hidden h-10 min-w-0 max-w-sm flex-1 items-center rounded-[var(--radius-control)] border border-border bg-surface-muted px-4 text-sm text-muted-foreground lg:inline-flex"
            title="Поиск появится в следующих версиях"
          >
            Поиск скоро
          </p>
          <span className="hidden shrink-0 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-muted-foreground sm:inline-flex">
            Level {profile?.level ?? 1} · {profile?.xpTotal ?? 0} XP
          </span>
          <ThemeToggle initialTheme={profile?.preferredTheme ?? "system"} />
          <Link
            className="inline-flex h-[var(--button-height-sm)] shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-transparent bg-primary px-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-sm)] transition-colors hover:bg-[var(--primary-hover)]"
            href="/goals"
          >
            Создать
          </Link>
        </div>
      </div>
    </header>
  );
}
