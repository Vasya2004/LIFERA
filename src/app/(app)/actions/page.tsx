import { ModulePreview } from "@/components/layout/module-preview";
import { PageContent } from "@/components/layout/page-content";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs } from "@/components/ui/tabs";

const plannedItems = [
  "Задачи как разовые действия с приоритетом и связью с целью.",
  "Привычки как повторяемые действия со streak и отметками.",
  "Фильтры: сегодня, запланировано, завершено.",
  "XP-события только через будущую серверную логику.",
];

export default function ActionsPage() {
  return (
    <>
      <PageHeader
        title="Действия"
        description="Ежедневные задачи и привычки, которые двигают цели, проекты и прогресс."
      />
      <PageContent>
        <Tabs
          items={[
            { active: true, label: "Задачи" },
            { label: "Привычки" },
            { label: "Завершенные" },
          ]}
        />
      </PageContent>
      <ModulePreview
        description="Действия объединяют разовые задачи и повторяемые привычки в одном рабочем разделе."
        items={plannedItems}
        metric="5 действий сегодня"
        progress={64}
        title="Каркас раздела Действия"
      />
    </>
  );
}
