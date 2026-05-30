import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type EmptyStateProps = {
  action?: string;
  children?: ReactNode;
  description: string;
  title: string;
};

export function EmptyState({
  action,
  children,
  description,
  title,
}: EmptyStateProps) {
  return (
    <Card className="grid gap-4 text-center" variant="muted">
      <div className="mx-auto h-10 w-10 rounded-full border border-[color:var(--border-primary-subtle)] bg-primary-subtle" />
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {action ? (
        <div>
          <Button>{action}</Button>
        </div>
      ) : null}
      {children}
    </Card>
  );
}
