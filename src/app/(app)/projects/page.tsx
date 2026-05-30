import { ModulePreview } from "@/components/layout/module-preview";
import { PageHeader } from "@/components/layout/page-header";

const plannedItems = [
  "Проекты объединяют цели, задачи, привычки и календарь.",
  "Каждый проект показывает прогресс и следующий шаг.",
  "Проект может быть связан с достижениями и XP-событиями.",
  "Полная логика появится после Core data foundation.",
];

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        title="Проекты"
        description="Крупные направления работы, которые связывают цели с конкретными действиями."
      />
      <ModulePreview
        description="Проекты удерживают крупные направления работы видимыми, не превращая Главную в свалку задач."
        items={plannedItems}
        metric="3 проекта в фокусе"
        progress={42}
        title="Каркас раздела Проекты"
      />
    </>
  );
}
