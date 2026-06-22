"use client";

import { useCallback, useEffect, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type DialogProps = {
  actionLabel?: string;
  children: ReactNode;
  description?: string;
  onClose?: () => void;
  onCloseLabel?: string;
  onConfirm?: () => void;
  open: boolean;
  title: string;
};

export function Dialog({
  actionLabel = "Продолжить",
  children,
  description,
  onClose,
  onCloseLabel = "Закрыть",
  onConfirm,
  open,
  title,
}: DialogProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleKeyDown, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[var(--overlay)] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <Card className="w-full max-w-lg" variant="elevated">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {title}
            </h2>
            {description ? (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          <Button aria-label={onCloseLabel} onClick={onClose} size="sm" variant="ghost">
            x
          </Button>
        </div>
        <div className="mt-6">{children}</div>
        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={onClose} variant="secondary">{onCloseLabel}</Button>
          {onConfirm ? <Button onClick={onConfirm}>{actionLabel}</Button> : null}
        </div>
      </Card>
    </div>
  );
}
