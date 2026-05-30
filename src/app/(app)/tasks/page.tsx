import { PageHeader } from "@/components/layout/page-header";
import { ModulePreview } from "@/components/layout/module-preview";

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
        title="Задачи"
        description="Legacy preview: в Core Navigation v0.2 задачи находятся внутри раздела “Действия”."
      />
      <ModulePreview
        description="Задачи переводят цели в конкретные ежедневные действия и будут доступны через Действия -> Задачи."
        items={plannedItems}
        metric="5 задач на сегодня"
        progress={64}
        title="Каркас задач"
      />
    </>
  );
}
