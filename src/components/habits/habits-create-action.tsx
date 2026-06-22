"use client";

import { PageActionRegistration } from "@/components/layout/page-actions";
import { HabitCreateModal } from "@/components/habits/habit-create-modal";
import type { Skill } from "@/lib/domain/types";

type HabitsCreateActionProps = {
  skills: Array<Pick<Skill, "id" | "title">>;
};

export function HabitsCreateAction({ skills }: HabitsCreateActionProps) {
  return (
    <PageActionRegistration
      actions={<HabitCreateModal className="w-full sm:w-auto" skills={skills} />}
    />
  );
}
