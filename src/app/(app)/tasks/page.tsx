import { PageHeader } from "@/components/layout/page-header";

const plannedItems = [
  "Список задач с базовыми статусами.",
  "Связь задач с целями и сферами жизни.",
  "Отметка выполнения задачи.",
  "Начисление XP через серверную логику в будущем.",
];

export default function TasksPage() {
  return (
    <>
      <PageHeader
        title="Tasks"
        description="Раздел для конкретных действий, которые двигают пользователя к целям."
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
