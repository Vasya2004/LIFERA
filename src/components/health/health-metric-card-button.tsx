"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { HealthEntryModal } from "@/components/health/health-entry-modal";

export function HealthMetricCardButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="inline-flex h-[var(--button-height-md)] items-center gap-2 rounded-[var(--radius-control)] border border-transparent bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-sm)] transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out hover:bg-[var(--primary-hover)]"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Plus className="h-4 w-4" />
        Добавить запись
      </button>
      {open ? <HealthEntryModal onClose={() => setOpen(false)} /> : null}
    </>
  );
}
