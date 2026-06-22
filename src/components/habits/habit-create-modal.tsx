"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import { CreateHabitForm } from "@/components/data/create-habit-form";
import { Button } from "@/components/ui/button";
import type { Skill } from "@/lib/domain/types";

type HabitCreateModalProps = {
  className?: string;
  skills: Array<Pick<Skill, "id" | "title">>;
};

export function HabitCreateModal({ className = "", skills }: HabitCreateModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button className={className} onClick={() => setOpen(true)}>
        <Plus size={18} />
        Создать привычку
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <button
              aria-label="Закрыть"
              className="absolute right-4 top-4 grid size-9 place-items-center rounded-full border border-border bg-surface-muted text-muted-foreground transition hover:text-foreground"
              onClick={() => setOpen(false)}
              type="button"
            >
              <X size={16} />
            </button>
            <div className="mb-5 pr-10">
              <h2 className="text-lg font-semibold text-foreground">Новая привычка</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Короткое регулярное действие с опытом и серией.
              </p>
            </div>
            <CreateHabitForm onSuccess={() => setOpen(false)} skills={skills} />
          </div>
        </div>
      ) : null}
    </>
  );
}
