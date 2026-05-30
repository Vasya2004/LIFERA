"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import type { GoalStatus } from "@/lib/domain/types";

type GoalActionsProps = {
  goalId: string;
  status: GoalStatus;
};

export function GoalActions({ goalId, status }: GoalActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function archiveGoal() {
    if (loading) {
      return;
    }

    setLoading(true);
    setMessage(null);

    const response = await fetch(`/api/goals/${goalId}`, {
      body: JSON.stringify({ status: "archived" }),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    });

    setLoading(false);
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setMessage(payload?.error ?? "Не удалось архивировать цель.");
      return;
    }

    router.refresh();
  }

  async function deleteGoal() {
    if (loading || !window.confirm("Удалить цель? Связанные челленджи останутся без привязки.")) {
      return;
    }

    setLoading(true);
    setMessage(null);

    const response = await fetch(`/api/goals/${goalId}`, { method: "DELETE" });
    setLoading(false);

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setMessage(payload?.error ?? "Не удалось удалить цель.");
      return;
    }

    router.refresh();
  }

  if (status === "archived") {
    return (
      <div className="mt-4 grid gap-3 border-t border-border pt-4">
        <Button loading={loading} onClick={deleteGoal} size="sm" variant="danger">
          Удалить из архива
        </Button>
        {message ? <p className="text-sm text-danger-foreground">{message}</p> : null}
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
      <Button loading={loading} onClick={archiveGoal} size="sm" variant="secondary">
        В архив
      </Button>
      <Button loading={loading} onClick={deleteGoal} size="sm" variant="danger">
        Удалить
      </Button>
      {message ? <p className="w-full text-sm text-danger-foreground">{message}</p> : null}
    </div>
  );
}
