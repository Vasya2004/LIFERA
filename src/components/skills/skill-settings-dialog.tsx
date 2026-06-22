"use client";

import { useEffect } from "react";

import { SkillEditForm } from "@/components/data/skill-edit-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Skill } from "@/lib/domain/types";

type SkillSettingsDialogProps = {
  onClose: () => void;
  open: boolean;
  skill: Pick<Skill, "category" | "id" | "level" | "progress" | "title">;
};

export function SkillSettingsDialog({ onClose, open, skill }: SkillSettingsDialogProps) {
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
            <h2 className="text-xl font-semibold tracking-tight">Настройка навыка</h2>
            <p className="mt-1 text-sm text-muted-foreground">{skill.title}</p>
          </div>
          <Button aria-label="Закрыть" onClick={onClose} size="sm" variant="ghost">
            ✕
          </Button>
        </div>
        <div className="mt-6">
          <SkillEditForm onSaved={onClose} skill={skill} />
        </div>
      </Card>
    </div>
  );
}
