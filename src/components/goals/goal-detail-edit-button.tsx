"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { GoalSettingsDialog } from "@/components/goals/goal-settings-dialog";
import { Button } from "@/components/ui/button";
import type { Goal, Wish } from "@/lib/domain/types";

type GoalDetailEditButtonProps = {
  goal: Pick<Goal, "description" | "id" | "life_area" | "status" | "target_date" | "title">;
  isPrimary?: boolean;
  linkedWishId?: string | null;
  wishes?: Wish[];
};

export function GoalDetailEditButton({
  goal,
  isPrimary = false,
  linkedWishId = null,
  wishes = [],
}: GoalDetailEditButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="shrink-0"
        onClick={() => setOpen(true)}
        size="sm"
        type="button"
        variant="secondary"
      >
        <Pencil aria-hidden="true" size={16} />
        Редактировать
      </Button>
      <GoalSettingsDialog
        goal={goal}
        isPrimary={isPrimary}
        linkedWishId={linkedWishId}
        onClose={() => setOpen(false)}
        open={open}
        wishes={wishes}
      />
    </>
  );
}
