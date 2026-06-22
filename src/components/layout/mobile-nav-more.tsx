"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { NavIcon } from "@/components/layout/nav-icon";
import { isNavigationActive, mobileMoreNavigationItems } from "@/config/navigation";

const mobileMoreOrder = [
  "/finance",
  "/achievements",
  "/skills",
  "/ai-assistant",
  "/plan",
  "/profile",
  "/settings",
];

export function MobileNavMore() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const sortedItems = mobileMoreOrder
    .map((href) => mobileMoreNavigationItems.find((item) => item.href === href))
    .filter((item): item is (typeof mobileMoreNavigationItems)[number] => Boolean(item));

  const isMoreSectionActive = sortedItems.some((item) => isNavigationActive(pathname, item.href));

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        aria-haspopup="menu"
        className={[
          "flex min-h-14 flex-col items-center justify-center gap-1 rounded-[var(--radius-control)] px-2 text-[11px] font-semibold transition-colors",
          open || isMoreSectionActive
            ? "bg-[color-mix(in_srgb,var(--primary)_10%,var(--surface))] text-primary"
            : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
        ].join(" ")}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <NavIcon name="menu" />
        Ещё
      </button>

      {open ? (
        <>
          <button
            aria-label="Закрыть меню"
            className="fixed inset-0 z-40 bg-[var(--overlay)] md:hidden"
            onClick={() => setOpen(false)}
            type="button"
          />
          <div
            aria-label="Дополнительная навигация"
            className="fixed inset-x-2 bottom-[calc(var(--mobile-nav-height,4.5rem)+0.5rem)] z-50 max-h-[min(70dvh,calc(100dvh-var(--mobile-nav-height,4.5rem)-1.5rem))] overflow-y-auto rounded-[var(--radius-card)] border border-border bg-surface-elevated p-2 shadow-[var(--shadow-lg)] md:hidden"
            role="menu"
          >
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Разделы
            </p>
            <div className="grid grid-cols-2 gap-1">
              {sortedItems.map((item) => {
                const isActive = isNavigationActive(pathname, item.href);

                return (
                  <Link
                    className={[
                      "flex min-h-12 items-center gap-2 rounded-[var(--radius-control)] px-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[color-mix(in_srgb,var(--primary)_10%,var(--surface))] text-primary"
                        : "text-foreground hover:bg-surface-muted",
                    ].join(" ")}
                    href={item.href}
                    key={item.href}
                    onClick={() => setOpen(false)}
                  >
                    <NavIcon name={item.icon} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
