"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type UserMenuProps = {
  email: string | null;
  fullName: string | null;
};

function initials(value: string | null) {
  if (!value) {
    return "L";
  }

  return value
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function UserMenu({ email, fullName }: UserMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const displayName = fullName || email?.split("@")[0] || "Пользователь";
  const menuStateProps = {
    "aria-expanded": open ? "true" : "false",
    "aria-haspopup": "menu",
  } as const;

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        aria-label="Меню пользователя"
        className="inline-flex h-[54px] items-center gap-2 rounded-full border border-border bg-surface-muted/70 px-1.5 pr-3 text-sm font-semibold text-foreground shadow-[var(--shadow-sm)] backdrop-blur-xl transition-colors hover:border-border-strong hover:bg-surface"
        onClick={() => setOpen((current) => !current)}
        type="button"
        {...menuStateProps}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[var(--accent-gold)] text-sm font-bold text-primary-foreground shadow-[var(--glow-primary-subtle)]">
          {initials(fullName || email)}
        </span>
        <span className="hidden max-w-24 truncate xl:inline">{displayName}</span>
        <ChevronDown aria-hidden="true" size={16} strokeWidth={2.15} />
      </button>

      {open ? (
        <div
          className="absolute right-0 top-full z-40 mt-2 w-52 rounded-[var(--radius-card)] border border-border bg-surface-elevated p-2 shadow-[var(--shadow-lg)]"
          role="menu"
        >
          <div className="border-b border-border px-3 py-2">
            <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
            <p className="truncate text-xs text-muted-foreground">{email ?? "Аккаунт Lifera"}</p>
          </div>
          <Link
            className="mt-1 block rounded-[var(--radius-control)] px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-muted"
            href="/profile"
            onClick={() => setOpen(false)}
            role="menuitem"
          >
            Профиль
          </Link>
          <Link
            className="block rounded-[var(--radius-control)] px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-muted"
            href="/plan"
            onClick={() => setOpen(false)}
            role="menuitem"
          >
            План
          </Link>
          <Link
            className="block rounded-[var(--radius-control)] px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-muted"
            href="/settings"
            onClick={() => setOpen(false)}
            role="menuitem"
          >
            Настройки
          </Link>
          <button
            className="mt-1 block w-full rounded-[var(--radius-control)] px-3 py-2 text-left text-sm font-medium text-danger hover:bg-danger-subtle"
            onClick={signOut}
            role="menuitem"
            type="button"
          >
            Выйти
          </button>
        </div>
      ) : null}
    </div>
  );
}
