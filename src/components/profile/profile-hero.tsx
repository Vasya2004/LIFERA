"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Zap, CreditCard, Pencil, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast-provider";
import { calculateLevel } from "@/lib/domain/gamification";
import { handleMutationError, showMutationSuccess } from "@/lib/ui/feedback";

type ProfileHeroProps = {
  avatarUrl: string | null;
  fullName: string | null;
  level: number;
  plan: string | null;
  streakDays: number;
  xpTotal: number;
};

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  ultra: "Ultra",
};

export function ProfileHero({
  avatarUrl,
  fullName,
  level,
  plan,
  streakDays,
  xpTotal,
}: ProfileHeroProps) {
  const [editing, setEditing] = useState(false);

  const displayName = fullName ?? "Без имени";
  const { nextLevelXp } = calculateLevel(xpTotal);
  const prevLevelXp = (level - 1) * 500;
  const xpInLevel = xpTotal - prevLevelXp;
  const xpNeeded = nextLevelXp - prevLevelXp;
  const progress = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  return (
    <>
      <Card className="relative overflow-hidden border-white/5 bg-zinc-900 p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="group relative shrink-0">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-orange-500/30 bg-zinc-800">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt="" className="h-full w-full object-cover" src={avatarUrl} />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {displayName
                    .split(" ")
                    .map((p: string) => p[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold text-white">{displayName}</h1>

            <div className="mt-2 flex items-center gap-3">
              <div className="flex h-9 items-center rounded-lg bg-orange-500 px-3 font-bold text-white">
                {level}
              </div>
              <span className="text-base text-zinc-300">Уровень {level}</span>
            </div>

            <div className="mt-3 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-orange-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-orange-400" />
                <span className="font-semibold text-white">{xpTotal}</span>
                <span className="text-xs text-zinc-400">Опыт</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="h-3.5 w-3.5 text-orange-400" />
                <span className="font-semibold text-white">{streakDays}</span>
                <span className="text-xs text-zinc-400">Серия</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-3.5 w-3.5 text-zinc-400" />
                <span className="font-semibold text-white">{PLAN_LABELS[plan ?? "free"] ?? "Free"}</span>
                <span className="text-xs text-zinc-400">Тариф</span>
              </div>
            </div>
          </div>

          <Button
            className="shrink-0 border border-orange-500/30 bg-orange-500 text-white hover:bg-orange-600"
            onClick={() => setEditing(true)}
            size="sm"
          >
            <Pencil className="h-3.5 w-3.5" />
            Редактировать
          </Button>
        </div>
      </Card>

      {editing && (
        <ProfileEditModal
          avatarUrl={avatarUrl}
          fullName={fullName}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  );
}

function ProfileEditModal({
  avatarUrl,
  fullName,
  onClose,
}: {
  avatarUrl: string | null;
  fullName: string | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(fullName ?? "");
  const [avatar, setAvatar] = useState(avatarUrl ?? "");

  async function submit() {
    if (loading) {
      return;
    }

    setLoading(true);
    const response = await fetch("/api/me", {
      body: JSON.stringify({ avatar_url: avatar || null, full_name: name }),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    });
    setLoading(false);

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      handleMutationError(toast, payload, "Не удалось обновить профиль.");
      return;
    }

    showMutationSuccess(toast, "Профиль обновлён");
    onClose();
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Редактировать профиль</h2>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Имя</label>
            <input
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-orange-500"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-400">URL аватара</label>
            <input
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-orange-500"
              onChange={(e) => setAvatar(e.target.value)}
              value={avatar}
            />
            {avatar && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-zinc-500">Превью:</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" className="h-8 w-8 rounded-full object-cover" src={avatar} />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <Button onClick={onClose} variant="secondary">
            Отмена
          </Button>
          <Button loading={loading} loadingLabel="Сохраняем..." onClick={submit}>
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  );
}
