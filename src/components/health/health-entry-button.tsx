"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { HealthEntryModal } from "@/components/health/health-entry-modal";
import { Button } from "@/components/ui/button";

type HealthEntryButtonProps = {
  className?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
};

export function HealthEntryButton({
  className = "",
  label = "Добавить запись",
  size = "md",
  variant = "primary",
}: HealthEntryButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button className={className} onClick={() => setOpen(true)} size={size} variant={variant}>
        <Plus size={16} />
        {label}
      </Button>
      {open ? <HealthEntryModal onClose={() => setOpen(false)} /> : null}
    </>
  );
}
