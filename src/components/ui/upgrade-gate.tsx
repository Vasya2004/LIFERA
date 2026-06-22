import type { ReactNode } from "react";
import Link from "next/link";

import { Card } from "@/components/ui/card";

type UpgradeGateProps = {
  children?: ReactNode;
  description: string;
  title: string;
};

export function UpgradeGate({ children, description, title }: UpgradeGateProps) {
  return (
    <Card className="border-[color:var(--border-primary-subtle)] bg-primary-subtle/40">
      <div className="grid gap-3">
        <p className="text-lg font-semibold text-foreground">{title}</p>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
        {children}
        <Link
          className="inline-flex h-[var(--button-height-sm)] w-fit items-center justify-center rounded-[var(--radius-control)] bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[var(--primary-hover)]"
          href="/plan"
        >
          Сравнить уровни Lifera
        </Link>
      </div>
    </Card>
  );
}
