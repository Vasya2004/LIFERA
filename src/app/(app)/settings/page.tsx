import { PageHeader } from "@/components/layout/page-header";

const plannedItems = [
  "Настройки интерфейса и приложения.",
  "Будущие настройки приватности.",
  "Управление уведомлениями после появления PWA.",
  "Интеграции только после отдельного проектирования.",
];

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Раздел для будущих настроек приложения, приватности и интеграций."
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
