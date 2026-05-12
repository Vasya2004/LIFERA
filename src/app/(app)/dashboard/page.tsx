import { PageHeader } from "@/components/layout/page-header";

const plannedItems = [
  "Сводка активных целей, задач и привычек на сегодня.",
  "Прогресс по XP, уровням и достижениям.",
  "Краткий блок следующего шага от AI Coach.",
  "Агрегированный прогресс по выбранным сферам жизни.",
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Центральный экран LifeOS для быстрого обзора состояния Core MVP."
      />
      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="rounded-lg border border-border bg-surface p-6">
          <p className="text-sm font-medium text-muted">Status: planned</p>
          <ul className="mt-5 grid gap-3 text-muted sm:grid-cols-2">
            {plannedItems.map((item) => (
              <li className="rounded-md border border-border bg-background p-4" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
