import Link from "next/link";

const onboardingSteps = [
  "Выбор сфер развития",
  "Создание первой цели",
  "Выбор стартовых привычек",
  "Первичная настройка AI Coach",
];

export default function OnboardingPage() {
  return (
    <section className="mx-auto max-w-4xl py-4">
      <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
        Первая цель, уровень и XP
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Onboarding
      </h1>
      <p className="mt-5 text-lg leading-8 text-muted">
        Настройте LifeOS под свои цели и привычки
      </p>

      <div className="mt-8 rounded-lg border border-border bg-surface p-6 shadow-sm">
        <p className="text-sm font-medium text-muted">Status: planned</p>

        <div
          aria-label="Прогресс onboarding"
          className="mt-6 grid grid-cols-4 gap-3"
        >
          {onboardingSteps.map((step, index) => (
            <div className="grid gap-2" key={step}>
              <div
                className={[
                  "h-2 rounded-full",
                  index === 0 ? "bg-indigo-600" : "bg-background",
                ].join(" ")}
              />
              <p className="text-xs font-medium text-muted">Шаг {index + 1}</p>
            </div>
          ))}
        </div>

        <ol className="mt-6 grid gap-4">
          {onboardingSteps.map((step, index) => (
            <li
              className="flex gap-4 rounded-md border border-border bg-background p-4"
              key={step}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                {index + 1}
              </span>
              <div>
                <p className="font-medium text-foreground">{step}</p>
                <p className="mt-1 text-sm leading-6 text-muted">
                  Будущий шаг настройки персональной системы прогресса.
                </p>
              </div>
            </li>
          ))}
        </ol>

        <Link
          className="mt-6 inline-flex rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
          href="/dashboard"
        >
          Перейти в Dashboard
        </Link>
      </div>
    </section>
  );
}
