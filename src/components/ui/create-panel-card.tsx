import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

type CreatePanelCardProps = {
  children: ReactNode;
  description: string;
  id: string;
  meta?: string;
  title: string;
};

export function CreatePanelCard({
  children,
  description,
  id,
  meta,
  title,
}: CreatePanelCardProps) {
  return (
    <Card className="lg:sticky lg:top-[calc(var(--topbar-height)+1rem)]" id={id}>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
      {meta ? <p className="mt-2 text-xs text-muted-foreground">{meta}</p> : null}
      <div className="mt-4">{children}</div>
    </Card>
  );
}
