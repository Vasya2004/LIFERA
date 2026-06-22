"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { CreateGoalForm } from "@/components/data/create-goal-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Wish } from "@/lib/domain/types";

type GoalCreateModalProps = {
  wishes?: Wish[];
};

export function GoalCreateModal({ wishes = [] }: GoalCreateModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <Button
        className="h-11 rounded-xl bg-primary px-6 text-base text-white hover:bg-[var(--primary-hover)]"
        onClick={() => setOpen(true)}
        type="button"
      >
        Создать цель
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-end p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:place-items-center">
          <button
            aria-label="Закрыть"
            className="absolute inset-0 bg-[var(--overlay)]"
            onClick={() => setOpen(false)}
            type="button"
          />
          <Card className="mobile-sheet-panel relative z-10 w-full max-w-xl" variant="elevated">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Новая цель</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Создайте стратегическое направление, вокруг которого Lifera соберёт привычки и
                  фокус.
                </p>
              </div>
              <Button
                aria-label="Закрыть"
                className="h-10 w-10 rounded-full p-0"
                onClick={() => setOpen(false)}
                size="sm"
                type="button"
                variant="secondary"
              >
                <X size={16} />
              </Button>
            </div>
            <div className="mt-6">
              <CreateGoalForm onSuccess={() => setOpen(false)} wishes={wishes} />
            </div>
          </Card>
        </div>
      ) : null}
    </>
  );
}
