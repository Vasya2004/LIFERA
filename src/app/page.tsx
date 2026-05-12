const coreMvpModules = [
  "Dashboard",
  "Goals",
  "Tasks",
  "Habits",
  "XP & Levels",
  "Achievements",
  "AI Coach",
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-16 sm:px-10 lg:px-12">
      <section className="flex flex-1 flex-col justify-center gap-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
            LifeOS
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted">
            Персональная цифровая экосистема для управления целями, задачами,
            привычками, прогрессом и развитием. Сейчас проект находится на
            этапе технического каркаса без бизнес-логики и внешних интеграций.
          </p>
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
              Будущие модули
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {coreMvpModules.map((module) => (
                <li
                  className="rounded-md border border-border bg-background px-4 py-3 text-sm font-medium text-foreground"
                  key={module}
                >
                  {module}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
