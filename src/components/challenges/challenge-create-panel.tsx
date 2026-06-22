import { CreateChallengeForm } from "@/components/data/create-challenge-form";
import { CreatePanelCard } from "@/components/ui/create-panel-card";
import type { Goal } from "@/lib/domain/types";

type ChallengeCreatePanelProps = {
  goals: Array<Pick<Goal, "id" | "title">>;
};

export function ChallengeCreatePanel({ goals }: ChallengeCreatePanelProps) {
  return (
    <CreatePanelCard
      description="Создайте привычку, которая превратит цель в последовательность этапов."
      id="create-challenge"
      title="Новая привычка"
    >
      <CreateChallengeForm goals={goals} />
    </CreatePanelCard>
  );
}
