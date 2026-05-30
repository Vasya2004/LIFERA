"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type SkillActionsProps = {
  skillId: string;
};

export function SkillActions({ skillId }: SkillActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function archiveSkill() {
    setLoading(true);
    setError(null);

    const response = await fetch(`/api/skills/${skillId}`, {
      body: JSON.stringify({ action: "archive" }),
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    });

    setLoading(false);

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error ?? "Не удалось архивировать навык.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="mt-3">
      <Button loading={loading} onClick={archiveSkill} size="sm" variant="secondary">
        Архивировать
      </Button>
      {error ? <p className="mt-2 text-sm text-danger-foreground">{error}</p> : null}
    </div>
  );
}
