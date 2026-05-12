import Link from "next/link";

const plannedFeatures = [
  "вход по email;",
  "восстановление доступа;",
  "переход к onboarding после первого входа;",
  "защита пользовательских данных через Supabase Auth в будущем.",
];

export default function AuthPage() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
      <div className="max-w-2xl py-4">
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
          Вход в систему
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Вход в LifeOS
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted">
          Продолжите управлять целями, привычками и прогрессом
        </p>

        <div className="mt-8 rounded-lg border border-border bg-surface p-6 shadow-sm">
          <p className="text-sm font-medium text-muted">Status: planned</p>
          <ul className="mt-5 grid gap-3 text-muted">
            {plannedFeatures.map((feature) => (
              <li
                className="rounded-md border border-border bg-background px-4 py-3"
                key={feature}
              >
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
        <div className="grid gap-5">
          <label className="grid gap-2 text-sm font-medium text-foreground">
            Email
            <input
              className="rounded-md border border-border bg-background px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted focus:border-indigo-400"
              name="email"
              placeholder="you@example.com"
              type="email"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-foreground">
            Пароль
            <input
              className="rounded-md border border-border bg-background px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted focus:border-indigo-400"
              name="password"
              placeholder="Введите пароль"
              type="password"
            />
          </label>

          <button
            className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
            type="button"
          >
            Войти
          </button>

          <div className="grid gap-3 border-t border-border pt-5 text-sm">
            <Link
              className="font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-300"
              href="/register"
            >
              Создать аккаунт
            </Link>
            <Link
              className="font-medium text-muted transition-colors hover:text-foreground"
              href="/dashboard"
            >
              Перейти в Dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
