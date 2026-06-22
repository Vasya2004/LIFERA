import { ModulePreview } from "@/components/layout/module-preview";
import { PageContent } from "@/components/layout/page-content";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs } from "@/components/ui/tabs";

const plannedItems = [
  "Фокус дня и действия по датам.",
  "Привычки на сегодня и быстрый перенос задач.",
  "Связь с проектами и целями.",
  "Неделя как основной планировочный слой.",
];

export default function CalendarPage() {
  return (
    <>
      <PageHeader
        title="Календарь"
        description="Планирование задач, привычек, проектов и фокуса во времени."
      />
      <PageContent>
        <Tabs
          items={[
            { active: true, label: "Сегодня" },
            { label: "Неделя" },
            { label: "Месяц" },
          ]}
        />
      </PageContent>
      <ModulePreview
        description="Календарь фокусируется на планировании действий, а не заменяет полноценный календарный продукт."
        items={plannedItems}
        metric="3 события на неделю"
        progress={36}
        title="Каркас раздела Календарь"
      />
    </>
  );
}
