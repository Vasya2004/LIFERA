"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigationItems } from "@/config/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 overflow-y-auto border-r border-border bg-surface px-4 py-5 md:block">
      <Link className="block px-3 py-2" href="/">
        <span className="text-xl font-semibold tracking-tight text-foreground">
          LifeOS
        </span>
        <span className="mt-1 block text-sm text-muted">Core MVP shell</span>
      </Link>

      <nav className="mt-8 space-y-1" aria-label="Основная навигация">
        {navigationItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              className={[
                "block rounded-lg px-3 py-3 transition-colors",
                isActive
                  ? "bg-foreground text-background"
                  : "text-muted hover:bg-background hover:text-foreground",
              ].join(" ")}
              href={item.href}
              key={item.href}
            >
              <span className="block text-sm font-medium">{item.label}</span>
              <span
                className={[
                  "mt-1 block text-xs leading-5",
                  isActive ? "text-background/75" : "text-muted",
                ].join(" ")}
              >
                {item.description}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
