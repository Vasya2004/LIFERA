"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import { CreateFinanceEntryForm } from "@/components/data/create-finance-entry-form";
import { Button } from "@/components/ui/button";
import type { FinanceSnapshot } from "@/lib/domain/finance";
import type { ReactNode } from "react";

type FinanceEntryModalProps = {
  className?: string;
  initialData?: FinanceSnapshot;
  trigger?: ReactNode;
};

export function FinanceEntryModal({ className = "", initialData, trigger }: FinanceEntryModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)}>
        {trigger ? (
          trigger
        ) : (
          <Button className={className} type="button">
            <Plus size={18} className="mr-1" />
            Добавить снимок
          </Button>
        )}
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-zinc-900">
            <button
              aria-label="Закрыть"
              className="absolute right-4 top-4 grid size-9 place-items-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-500 transition hover:text-zinc-950 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:text-white"
              onClick={() => setOpen(false)}
              type="button"
            >
              <X size={16} />
            </button>
            <div className="mb-5 pr-10">
              <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">
                {initialData ? "Редактировать снимок" : "Новый финансовый снимок"}
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {initialData ? "Измените параметры сохранённого снимка." : "Зафиксируйте капитал, цель, доходы и расходы вручную."}
              </p>
            </div>
            <CreateFinanceEntryForm initialData={initialData} onSuccess={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}
