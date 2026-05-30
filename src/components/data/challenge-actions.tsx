"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { ChallengeStatus } from "@/lib/domain/types";

type ChallengeActionsProps = {
  challengeId: string;
  status: ChallengeStatus;
};

export function ChallengeActions({ challengeId, status }: ChallengeActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function updateStatus(value: string) {
    setLoading(true);
    setMessage(null);

    const response = await fetch(`/api/challenges/${challengeId}`, {
      body: JSON.stringify({ status: value }),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    });

    setLoading(false);
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setMessage(payload?.error ?? "Не удалось обновить челлендж.");
      return;
    }

    router.refresh();
  }

  async function deleteChallenge() {
    setLoading(true);
    setMessage(null);

    const response = await fetch(`/api/challenges/${challengeId}`, { method: "DELETE" });
    setLoading(false);

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setMessage(payload?.error ?? "Не удалось удалить челлендж.");
      return;
    }

    router.push("/challenges");
    router.refresh();
  }

  return (
    <div className="grid gap-3">
      <Select
        defaultValue={status}
        disabled={loading}
        label="Статус"
        name="challenge_status"
        onChange={(event) => updateStatus(event.currentTarget.value)}
      >
        <option value="active">Активная</option>
        <option value="paused">На паузе</option>
        <option value="completed">Завершена</option>
        <option value="archived">В архиве</option>
      </Select>
      <Button loading={loading} onClick={deleteChallenge} size="sm" variant="danger">
        Удалить челлендж
      </Button>
      {message ? <p className="text-sm text-danger-foreground">{message}</p> : null}
    </div>
  );
}
