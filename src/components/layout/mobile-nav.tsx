"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MobileNavMore } from "@/components/layout/mobile-nav-more";
import { NavIcon } from "@/components/layout/nav-icon";
import { isNavigationActive, mobilePrimaryNavigationItems } from "@/config/navigation";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Мобильная навигация"
      className="mobile-nav-surface fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] pt-2 backdrop-blur md:hidden"
      style={{
        ["--mobile-nav-height" as string]:
          "calc(4.5rem + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="grid grid-cols-5 gap-1">
        {mobilePrimaryNavigationItems.map((item) => {
          const isActive = isNavigationActive(pathname, item.href);

          return (
            <Link
              className={[
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-[var(--radius-control)] px-2 text-[11px] font-semibold transition-colors",
                isActive
                  ? "bg-[color-mix(in_srgb,var(--primary)_7%,var(--surface))] text-primary"
                  : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
              ].join(" ")}
              href={item.href}
              key={item.href}
            >
              <NavIcon name={item.icon} />
              {item.label}
            </Link>
          );
        })}
        <MobileNavMore />
      </div>
    </nav>
  );
}
