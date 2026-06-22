"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import { CreateSkillForm } from "@/components/data/create-skill-form";
import { Button } from "@/components/ui/button";

type SkillCreateModalProps = {
  className?: string;
  label?: string;
};

export function SkillCreateModal({ className = "", label = "Новый навык" }: SkillCreateModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button className={className} onClick={() => setOpen(true)}>
        <Plus size={18} />
        {label}
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-end p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:place-items-center">
          <button
            aria-label="Закрыть"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            type="button"
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-zinc-900">
            <button
              aria-label="Закрыть"
              className="absolute right-4 top-4 grid size-9 place-items-center rounded-full border border-zinc-200 bg-zinc-100 text-zinc-500 transition hover:text-zinc-900 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:text-white"
              onClick={() => setOpen(false)}
              type="button"
            >
              <X size={16} />
            </button>
            <div className="mb-5 pr-10">
              <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                Добавить навык
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Зафиксируйте компетенцию для регулярной прокачки.
              </p>
            </div>
            <CreateSkillForm onSuccess={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}
