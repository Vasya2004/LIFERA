import { CreateGoalForm } from "@/components/data/create-goal-form";
import { CreatePanelCard } from "@/components/ui/create-panel-card";
import type { Wish } from "@/lib/domain/types";

type GoalCreatePanelProps = {
  wishes?: Wish[];
};

export function GoalCreatePanel({ wishes = [] }: GoalCreatePanelProps) {
  return (
    <CreatePanelCard
      description="Создайте стратегическое направление, вокруг которого Lifera соберёт привычки и фокус."
      id="create-goal"
      meta="На Free — до 3 активных целей."
      title="Новая цель"
    >
      <CreateGoalForm wishes={wishes} />
    </CreatePanelCard>
  );
}
