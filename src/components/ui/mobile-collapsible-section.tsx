"use client";

import { useState, type ReactNode } from "react";

import { Card } from "@/components/ui/card";

type MobileCollapsibleSectionProps = {
  children: ReactNode;
  defaultOpen?: boolean;
  description?: string;
  title: string;
};

export function MobileCollapsibleSection({
  children,
  defaultOpen = false,
  description,
  title,
}: MobileCollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <>
      <div className="lg:hidden">
        <Card className="overflow-hidden p-0">
          <button
            aria-expanded={open}
            className="touch-target flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
            onClick={() => setOpen((current) => !current)}
            type="button"
          >
            <span className="text-base font-semibold text-foreground">{title}</span>
            <span aria-hidden className="text-sm text-muted-foreground">
              {open ? "Свернуть" : "Открыть"}
            </span>
          </button>
          {open ? (
            <div className="border-t border-border px-4 pb-4 pt-3">
              {description ? (
                <p className="mb-3 text-sm leading-6 text-muted-foreground">{description}</p>
              ) : null}
              {children}
            </div>
          ) : null}
        </Card>
      </div>

      <Card className="hidden lg:block">
        <h2 className="text-xl font-semibold">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        ) : null}
        <div className="mt-4">{children}</div>
      </Card>
    </>
  );
}
