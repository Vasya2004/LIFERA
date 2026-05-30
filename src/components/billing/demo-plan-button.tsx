"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import type { PaidPlanTier } from "@/lib/domain/subscription";

type DemoPlanButtonProps = {
  plan: PaidPlanTier;
};

const PLAN_LABELS: Record<PaidPlanTier, string> = {
  pro: "Pro",
  ultra: "Ultra",
};

export function DemoPlanButton({ plan }: DemoPlanButtonProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function activate() {
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/subscription/activate-demo", {
      body: JSON.stringify({ plan }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: "Activation failed." }));
      setMessage(payload.error ?? "Не удалось активировать demo-план.");
      setLoading(false);
      return;
    }

    setMessage(`Demo ${PLAN_LABELS[plan]} активирован.`);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="grid gap-3">
      <Button loading={loading} onClick={activate} size="sm" variant="secondary">
        Demo {PLAN_LABELS[plan]}
      </Button>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
