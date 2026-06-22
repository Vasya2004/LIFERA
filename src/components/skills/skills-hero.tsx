import { BookOpen, Flame, Star, Zap } from "lucide-react";

import { SkillCreateModal } from "@/components/skills/skill-create-modal";
import type { SkillsHeroSummary, SkillWithActivities } from "@/lib/domain/skills";

type SkillsHeroProps = {
  hero: SkillsHeroSummary;
  skills: SkillWithActivities[];
};

function xpTarget(level: number) {
  return Math.max(200, level * 100);
}

export function SkillsHero({ hero, skills }: SkillsHeroProps) {
  const topSkill = hero.topSkill
    ? (skills.find((skill) => skill.title === hero.topSkill?.title) ?? null)
    : null;
  const weeklyDone = skills.reduce(
    (sum, skill) =>
      sum + skill.linkedHabits.filter((habit) => habit.last_completed_at).length,
    0,
  );

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {/* Главный навык */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/5 dark:bg-zinc-900/70">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
          Главный навык
        </p>
        {topSkill ? (
          <>
            <div className="mt-4 flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-100 dark:bg-amber-500/10">
                <BookOpen className="text-amber-600 dark:text-amber-400" size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-base font-bold text-zinc-950 dark:text-zinc-50">
                  {topSkill.title}
                </h2>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  Уровень {topSkill.computedLevel}
                </p>
              </div>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-amber-500"
                style={{
                  width: `${Math.min(100, Math.round((topSkill.computedXp / xpTarget(topSkill.computedLevel)) * 100))}%`,
                }}
              />
            </div>
            <p className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
              {topSkill.computedXp} / {xpTarget(topSkill.computedLevel)} XP
            </p>
          </>
        ) : (
          <div className="mt-4 flex flex-col items-start gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
              <Star className="text-zinc-400 dark:text-zinc-500" size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                Главный навык не выбран
              </p>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                Создайте навык, чтобы видеть его прогресс здесь
              </p>
            </div>
            <SkillCreateModal className="h-8 rounded-lg px-3 text-xs" label="Добавить" />
          </div>
        )}
      </div>

      {/* Практика недели */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/5 dark:bg-zinc-900/70">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
          Практика недели
        </p>
        {hero.totalXp > 0 || weeklyDone > 0 ? (
          <div className="mt-4 flex items-center gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-orange-200/60 bg-orange-50 dark:border-orange-500/20 dark:bg-orange-500/10">
              <Flame className="text-orange-600 dark:text-orange-400" size={20} />
            </span>
            <div>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                +{hero.totalXp} XP
              </p>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                {weeklyDone} практик выполнено
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            <div className="grid size-9 place-items-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
              <Zap className="text-zinc-400 dark:text-zinc-500" size={18} />
            </div>
            <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Практика появится после первых действий
            </p>
            <SkillCreateModal className="h-8 rounded-lg px-3 text-xs" label="Создать навык" />
          </div>
        )}
      </div>

      {/* Всего навыков */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/5 dark:bg-zinc-900/70">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            Всего навыков
          </p>
          <Star className="text-zinc-300 dark:text-zinc-600" size={16} />
        </div>
        <p className="mt-6 text-4xl font-bold text-zinc-950 dark:text-zinc-50">{hero.totalCount}</p>
        {hero.totalCount === 0 ? (
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Создайте первый навык или выберите шаблон
          </p>
        ) : (
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            {hero.activeCount} активных · ср. прогресс {hero.averageProgress}%
          </p>
        )}
      </div>
    </section>
  );
}
