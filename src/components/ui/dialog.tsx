import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type DialogProps = {
  actionLabel?: string;
  children: ReactNode;
  description?: string;
  onCloseLabel?: string;
  title: string;
};

export function Dialog({
  actionLabel = "Продолжить",
  children,
  description,
  onCloseLabel = "Закрыть",
  title,
}: DialogProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--overlay)] p-4">
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
          <Button aria-label={onCloseLabel} size="sm" variant="ghost">
            x
          </Button>
        </div>
        <div className="mt-6">{children}</div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary">{onCloseLabel}</Button>
          <Button>{actionLabel}</Button>
        </div>
      </Card>
    </div>
  );
}
