"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";

import { ChallengeSettingsDialog } from "@/components/challenges/challenge-settings-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ChallengeWithMeta } from "@/lib/domain/challenges-page";
import { CHALLENGE_STATUS_LABELS, formatLifeArea } from "@/lib/domain/labels";
import type { Goal } from "@/lib/domain/types";

type ChallengeProductCardProps = {
  challenge: ChallengeWithMeta;
  goals: Array<Pick<Goal, "id" | "title">>;
  variant?: "active" | "compact";
};

export function ChallengeProductCard({
  challenge,
  goals,
  variant = "active",
}: ChallengeProductCardProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const progress = Number(challenge.progress);
  const stageLabel =
    challenge.totalStagesCount > 0
      ? `${challenge.completedStagesCount} из ${challenge.totalStagesCount} этапов`
      : "Этапы не настроены";

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function onPointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [menuOpen]);

  async function updateStatus(status: string) {
    if (loading) {
      return;
    }

    setLoading(true);
    setMenuOpen(false);

    const response = await fetch(`/api/challenges/${challenge.id}`, {
      body: JSON.stringify({ status }),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    });

    setLoading(false);
    if (response.ok) {
      router.refresh();
    }
  }

  async function deleteChallenge() {
    if (
      loading ||
      !window.confirm("Удалить привычку? Этапы будут удалены вместе с ней.")
    ) {
      return;
    }

    setLoading(true);
    setMenuOpen(false);

    const response = await fetch(`/api/challenges/${challenge.id}`, { method: "DELETE" });
    setLoading(false);

    if (response.ok) {
      router.refresh();
    }
  }

  function renderMenuItems() {
    const items: Array<{ danger?: boolean; label: string; onClick: () => void }> = [
      {
        label: "Настроить",
        onClick: () => {
          setMenuOpen(false);
          setSettingsOpen(true);
        },
      },
    ];

    if (challenge.status === "active") {
      items.push({ label: "Приостановить", onClick: () => updateStatus("paused") });
      items.push({ label: "Завершить", onClick: () => updateStatus("completed") });
      items.push({ label: "Архивировать", onClick: () => updateStatus("archived") });
    }

    if (challenge.status === "paused") {
      items.push({ label: "Возобновить", onClick: () => updateStatus("active") });
      items.push({ label: "Архивировать", onClick: () => updateStatus("archived") });
    }

    if (challenge.status === "completed") {
      items.push({ label: "Архивировать", onClick: () => updateStatus("archived") });
    }

    items.push({ danger: true, label: "Удалить", onClick: deleteChallenge });

    return items;
  }

  const menu = (
    <div className="relative shrink-0" ref={menuRef}>
      <Button
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        aria-label="Действия с привычкой"
        className="touch-target"
        onClick={() => setMenuOpen((open) => !open)}
        size="sm"
        variant="secondary"
      >
        <MoreHorizontal size={16} />
      </Button>

      {menuOpen ? (
        <div
          className="absolute right-0 top-full z-20 mt-2 min-w-44 rounded-[var(--radius-control)] border border-border bg-surface-elevated p-1 shadow-[var(--shadow-md)]"
          role="menu"
        >
          {renderMenuItems().map((item) => (
            <button
              className={`block w-full rounded-[calc(var(--radius-control)-4px)] px-3 py-2 text-left text-sm font-medium ${
                item.danger
                  ? "text-danger hover:bg-danger-subtle"
                  : "text-foreground hover:bg-surface-muted"
              }`}
              disabled={loading}
              key={item.label}
              onClick={item.onClick}
              role="menuitem"
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );

  if (variant === "compact") {
    return (
      <>
        <div className="rounded-[var(--radius-control)] border border-border bg-surface-muted px-4 py-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">{challenge.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {challenge.goalTitle ? challenge.goalTitle : "Без цели"} · {progress}% ·{" "}
                {CHALLENGE_STATUS_LABELS[challenge.status] ?? challenge.status}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link href={`/challenges/${challenge.id}`}>
                <Button size="sm" variant="secondary">
                  Открыть
                </Button>
              </Link>
              {menu}
            </div>
          </div>
        </div>
        <ChallengeSettingsDialog
          challenge={challenge}
          goals={goals}
          onClose={() => setSettingsOpen(false)}
          open={settingsOpen}
        />
      </>
    );
  }

  return (
    <>
      <Card className="grid gap-4 border-[color:var(--border-primary-subtle)]/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {challenge.lifeArea ? (
                <Badge variant="primary">{formatLifeArea(challenge.lifeArea)}</Badge>
              ) : null}
              <Badge variant="muted">
                {CHALLENGE_STATUS_LABELS[challenge.status] ?? challenge.status}
              </Badge>
            </div>
            <h3 className="mt-3 text-lg font-semibold text-foreground">{challenge.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {challenge.goalTitle ? `Цель: ${challenge.goalTitle}` : "Цель не привязана"}
            </p>
          </div>
          {menu}
        </div>

        <div>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">Прогресс</span>
            <span className="font-semibold text-foreground">{progress}%</span>
          </div>
          <Progress className="mt-2" tone="primary" value={progress} />
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{stageLabel}</p>
        </div>

        {challenge.nextStepTitle ? (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Следующий этап:</span>{" "}
            {challenge.nextStepTitle}
          </p>
        ) : null}

        <Link href={`/challenges/${challenge.id}`}>
          <Button size="sm">
            Открыть привычку
          </Button>
        </Link>
      </Card>

      <ChallengeSettingsDialog
        challenge={challenge}
        goals={goals}
        onClose={() => setSettingsOpen(false)}
        open={settingsOpen}
      />
    </>
  );
}
