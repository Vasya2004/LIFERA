import { CreateHabitForm } from "@/components/data/create-habit-form";
import { CreatePanelCard } from "@/components/ui/create-panel-card";
import type { Skill } from "@/lib/domain/types";

type HabitCreatePanelProps = {
  skills: Array<Pick<Skill, "id" | "title">>;
};

export function HabitCreatePanel({ skills }: HabitCreatePanelProps) {
  return (
    <CreatePanelCard
      description="Привычка — короткое регулярное действие с опытом и серией."
      id="create-habit"
      title="Новая привычка"
    >
      <CreateHabitForm skills={skills} />
    </CreatePanelCard>
  );
}
