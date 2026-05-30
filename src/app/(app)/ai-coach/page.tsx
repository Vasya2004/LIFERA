import { PageHeader } from "@/components/layout/page-header";
import { ModulePreview } from "@/components/layout/module-preview";

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
        title="AI Ассистент"
        description="Legacy route: в UI используется название “AI Ассистент”."
      />
      <ModulePreview
        description="AI Ассистент предлагает один практический следующий шаг через будущие backend-only AI calls."
        items={plannedItems}
        metric="1 следующий шаг"
        progress={38}
        title="Каркас AI Ассистента"
      />
    </>
  );
}
