"use client";

import { useEffect } from "react";

import { HabitEditForm } from "@/components/habits/habit-edit-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Habit } from "@/lib/domain/types";

type HabitSettingsDialogProps = {
  habit: Habit;
  onClose: () => void;
  open: boolean;
};

export function HabitSettingsDialog({ habit, onClose, open }: HabitSettingsDialogProps) {
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
            <h2 className="text-xl font-semibold tracking-tight">Настройка привычки</h2>
            <p className="mt-1 text-sm text-muted-foreground">{habit.title}</p>
          </div>
          <Button aria-label="Закрыть" onClick={onClose} size="sm" variant="ghost">
            ✕
          </Button>
        </div>
        <div className="mt-6">
          <HabitEditForm habit={habit} onCancel={onClose} onSaved={onClose} />
        </div>
      </Card>
    </div>
  );
}
