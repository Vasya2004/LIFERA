import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

type PageHeroCardProps = {
  children?: ReactNode;
  hint?: string;
  spotlight?: ReactNode;
  title: string;
  variant?: "default" | "highlight";
};

export function PageHeroCard({
  children,
  hint,
  spotlight,
  title,
  variant = "default",
}: PageHeroCardProps) {
  const isHighlight = variant === "highlight";

  return (
    <Card
      className={[
        "relative grid gap-5 overflow-hidden",
        isHighlight
          ? "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top_right,rgba(255,90,31,0.1),transparent_55%)]"
          : "",
      ].join(" ")}
      variant={isHighlight ? "highlight" : "default"}
    >
      <div className="relative">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {spotlight ? (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{spotlight}</p>
        ) : hint ? (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{hint}</p>
        ) : null}
      </div>
      {children ? <div className="relative grid gap-5">{children}</div> : null}
    </Card>
  );
}
