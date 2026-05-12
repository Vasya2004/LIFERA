"use client";

import { usePathname } from "next/navigation";

import { navigationItems } from "@/config/navigation";

export function Topbar() {
  const pathname = usePathname();
  const currentSection = navigationItems.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/90 px-5 py-4 backdrop-blur sm:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">LifeOS Core MVP</p>
          <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
            {currentSection?.label ?? "Workspace"}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted">
          Core MVP
        </span>
      </div>
    </header>
  );
}
