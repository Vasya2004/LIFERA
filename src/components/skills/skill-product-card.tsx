"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Bot,
  Brain,
  CheckSquare,
  Code2,
  Crosshair,
  Megaphone,
  MessageCircle,
  MoreVertical,
  PenLine,
  Target,
  Users,
} from "lucide-react";

import { SkillSettingsDialog } from "@/components/skills/skill-settings-dialog";
import { Button } from "@/components/ui/button";
import type { SkillWithActivities } from "@/lib/domain/skills";

type SkillProductCardProps = {
  skill: SkillWithActivities;
};

function xpTarget(level: number) {
  return Math.max(200, level * 100);
}

function completedThisWeek(skill: SkillWithActivities) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return skill.linkedHabits.filter((habit) => {
    if (!habit.last_completed_at) {
      return false;
    }
    return new Date(habit.last_completed_at).getTime() >= weekAgo;
  }).length;
}

function skillIcon(title: string, category: string) {
  const normalized = title.toLowerCase();
  const cls = "text-zinc-500 dark:text-zinc-300";

  if (category === "tech" && normalized.includes("ai")) return <Bot className={cls} size={18} />;
  if (category === "tech") return <Code2 className={cls} size={18} />;
  if (category === "language" || normalized.includes("англ")) return <BookOpen className={cls} size={18} />;
  if (normalized.includes("ux") || normalized.includes("дизайн")) return <PenLine className={cls} size={18} />;
  if (normalized.includes("маркет")) return <Megaphone className={cls} size={18} />;
  if (category === "finance_literacy" || normalized.includes("финанс")) return <BarChart3 className={cls} size={18} />;
  if (normalized.includes("дисцип")) return <Target className={cls} size={18} />;
  if (category === "communication" || normalized.includes("коммуник")) return <MessageCircle className={cls} size={18} />;
  if (normalized.includes("фокус")) return <Crosshair className={cls} size={18} />;
  if (normalized.includes("лидер")) return <Users className={cls} size={18} />;
  if (normalized.includes("крит")) return <Brain className={cls} size={18} />;
  if (normalized.includes("само")) return <CheckSquare className={cls} size={18} />;

  return <BookOpen className={cls} size={18} />;
}

function growthBar(skill: SkillWithActivities, weekly: number) {
  if (skill.status === "archived") return "bg-zinc-400 dark:bg-zinc-600";
  if (weekly > 2) return "bg-green-500";
  if (weekly > 0) return "bg-orange-500";
  return "bg-zinc-300 dark:bg-zinc-600";
}

export function SkillProductCard({ skill }: SkillProductCardProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const weekly = completedThisWeek(skill);
  const totalPoints =
    skill.linkedGoals.length + skill.linkedHabits.length + skill.linkedChallenges.length;
  const target = xpTarget(skill.computedLevel);
  const progress = Math.min(100, Math.round((skill.computedXp / target) * 100));

  useEffect(() => {
    if (!menuOpen) return;

    function onPointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [menuOpen]);

  async function archiveSkill() {
    if (archiving) return;
    setArchiving(true);
    setMenuOpen(false);

    const response = await fetch(`/api/skills/${skill.id}`, {
      body: JSON.stringify({ action: "archive" }),
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    });

    setArchiving(false);
    if (!response.ok) return;
    router.refresh();
  }

  const noGrowth = weekly === 0 && skill.status !== "archived";

  return (
    <>
      <article className="flex min-w-0 flex-col gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/5 dark:bg-zinc-800/50 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-zinc-200 bg-white dark:border-white/5 dark:bg-zinc-800">
            {skillIcon(skill.title, skill.category)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <h3 className="min-w-0 truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                {skill.title}
              </h3>
              <span className="shrink-0 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-600 dark:border-white/10 dark:bg-zinc-950/45 dark:text-zinc-300">
                Уровень {skill.computedLevel}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
              <span>{skill.computedXp} / {target} XP</span>
              <span>Пунктов: {totalPoints}</span>
              <span>Неделя: {weekly}</span>
              {noGrowth ? <span className="text-zinc-400 dark:text-zinc-500">Нет практик</span> : null}
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className={["h-full rounded-full transition-all", growthBar(skill, weekly)].join(" ")}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto">
          <Button
            className="h-9 flex-1 rounded-lg border-zinc-200 bg-white px-4 text-xs text-zinc-700 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 sm:flex-none"
            onClick={() => setSettingsOpen(true)}
            size="sm"
            variant="secondary"
          >
            Открыть
          </Button>

          <div className="relative" ref={menuRef}>
            <Button
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-label="Действия с навыком"
              className="size-9 px-0"
              onClick={() => setMenuOpen((o) => !o)}
              size="sm"
              variant="ghost"
            >
              <MoreVertical size={16} />
            </Button>

            {menuOpen ? (
              <div
                className="absolute right-0 top-full z-20 mt-2 min-w-44 rounded-xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-white/10 dark:bg-zinc-950"
                role="menu"
              >
                <button
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-900 hover:bg-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-800"
                  onClick={() => {
                    setMenuOpen(false);
                    setSettingsOpen(true);
                  }}
                  role="menuitem"
                  type="button"
                >
                  Редактировать
                </button>
                <button
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                  disabled={archiving}
                  onClick={archiveSkill}
                  role="menuitem"
                  type="button"
                >
                  Архивировать
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </article>

      <SkillSettingsDialog onClose={() => setSettingsOpen(false)} open={settingsOpen} skill={skill} />
    </>
  );
}
