import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

const publicLinks = [
  { href: "/pricing", label: "Тарифы" },
  { href: "/login", label: "Вход" },
  { href: "/register", label: "Регистрация" },
];

type PublicShellProps = {
  children: ReactNode;
};

export function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface/85 px-5 py-4 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link className="inline-flex w-fit flex-col" href="/">
            <Image
              alt="LIFERA"
              className="h-6 w-auto dark:invert"
              height={145}
              priority
              src="/brand/lifera-wordmark.svg"
              width={661}
            />
            <span className="text-sm text-muted">
              Personal ecosystem for goals, challenges and progress
            </span>
          </Link>

          <nav
            aria-label="Публичная навигация"
            className="flex flex-wrap gap-2"
          >
            {publicLinks.map((item) => (
              <Link
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-primary/30 hover:text-foreground"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
