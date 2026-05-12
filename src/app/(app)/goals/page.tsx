import { PageHeader } from "@/components/layout/page-header";

const plannedItems = [
  "Создание и редактирование целей.",
  "Связь цели со сферой жизни.",
  "Прогресс цели на основе задач и привычек.",
  "AI-помощь с формулировкой и декомпозицией цели.",
];

export default function GoalsPage() {
  return (
    <>
      <PageHeader
        title="Goals"
        description="Раздел для постановки долгосрочных и краткосрочных целей пользователя."
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
