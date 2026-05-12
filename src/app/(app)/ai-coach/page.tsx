import { PageHeader } from "@/components/layout/page-header";

const plannedItems = [
  "Помощь с формулировкой цели.",
  "Декомпозиция цели на задачи.",
  "Предложение привычек под цель или сферу жизни.",
  "Backend-only вызовы AI API в будущем.",
];

export default function AiCoachPage() {
  return (
    <>
      <PageHeader
        title="AI Coach"
        description="Раздел будущего AI-помощника для целей, задач, привычек и следующего шага."
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
