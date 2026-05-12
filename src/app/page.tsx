import Link from "next/link";

import { navigationItems } from "@/config/navigation";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-10 px-6 py-16 sm:px-10 lg:px-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
            LifeOS
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted">
            Персональная цифровая экосистема для управления жизнью, целями,
            задачами, привычками, достижениями и прогрессом.
          </p>
          <Link
            className="mt-8 inline-flex rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            href="/dashboard"
          >
            Открыть Dashboard
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-xl font-medium text-foreground">Core MVP</h2>
            <p className="mt-3 leading-7 text-muted">
              Первая рабочая версия будет сфокусирована на основном цикле:
              цель, задачи и привычки, выполнение, XP, достижения, Dashboard и
              ограниченный AI Coach через backend.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-xl font-medium text-foreground">
              Core MVP
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {navigationItems.map((item) => (
                <li
                  className="rounded-md border border-border bg-background px-4 py-3 text-sm font-medium text-foreground"
                  key={item.href}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6">
          <h2 className="text-xl font-medium text-foreground">
            Документация проекта уже заложена
          </h2>
          <p className="mt-3 leading-7 text-muted">
            В `docs/` зафиксированы продуктовая спецификация, структура
            приложения, модель данных, геймификация, AI Coach, roadmap и
            правила для AI-assisted development.
          </p>
        </div>
      </section>
    </main>
  );
}
