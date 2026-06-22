"use client";

import { useEffect } from "react";

import { GoalEditForm } from "@/components/data/goal-edit-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Goal, Wish } from "@/lib/domain/types";

type GoalSettingsDialogProps = {
  goal: Pick<
    Goal,
    "description" | "id" | "life_area" | "status" | "target_date" | "title"
  >;
  isPrimary?: boolean;
  linkedWishId?: string | null;
  onClose: () => void;
  open: boolean;
  wishes?: Wish[];
};

export function GoalSettingsDialog({
  goal,
  isPrimary = false,
  linkedWishId = null,
  onClose,
  open,
  wishes = [],
}: GoalSettingsDialogProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:place-items-center">
      <button
        aria-label="Закрыть"
        className="absolute inset-0 bg-[var(--overlay)]"
        onClick={onClose}
        type="button"
      />
      <Card
        className="mobile-sheet-panel relative z-10 w-full max-w-lg"
        variant="elevated"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Настройка цели</h2>
            <p className="mt-1 text-sm text-muted-foreground">{goal.title}</p>
          </div>
          <Button aria-label="Закрыть" onClick={onClose} size="sm" variant="ghost">
            ✕
          </Button>
        </div>
        <div className="mt-6">
          <GoalEditForm
            goal={goal}
            isPrimary={isPrimary}
            linkedWishId={linkedWishId}
            onCancel={onClose}
            onSaved={onClose}
            wishes={wishes}
          />
        </div>
      </Card>
    </div>
  );
}
