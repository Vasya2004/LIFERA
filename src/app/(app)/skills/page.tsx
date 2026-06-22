import Link from "next/link";
import {
  Brain,
  Code2,
  FolderArchive,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

import { SkillProductCard } from "@/components/skills/skill-product-card";
import { SkillCreateModal } from "@/components/skills/skill-create-modal";
import { SkillsCreateAction } from "@/components/skills/skills-create-action";
import { SkillsSidePanel } from "@/components/skills/skills-side-panel";
import { SkillsHero } from "@/components/skills/skills-hero";
import { PageContent } from "@/components/layout/page-content";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/session";
import { getSkillsBranchData } from "@/lib/domain/skills";
import type { SkillWithActivities } from "@/lib/domain/skills";

export const dynamic = "force-dynamic";

// ── Category helpers ──────────────────────────────────────────────────────────

const hardCategories = new Set(["tech", "product", "finance_literacy", "language"]);
const softTitleMarkers = ["дисцип", "коммуник", "фокус", "лидер", "крит", "само"];

function isHardSkill(skill: { category: string; title: string }) {
  if (softTitleMarkers.some((m) => skill.title.toLowerCase().includes(m))) return false;
  return hardCategories.has(skill.category) || !skill.category;
}

// ── View / filter parsing ─────────────────────────────────────────────────────

type SkillsView = "focus" | "all";
type SkillsFilter = "all" | "active" | "development" | "archive";

const VALID_FILTERS = new Set<string>(["all", "active", "development", "archive"]);

function parseView(v?: string): SkillsView {
  if (v === "all" || v === "active" || v === "archive") {
    return "all";
  }

  return "focus";
}
function parseFilter(v?: string): SkillsFilter {
  if (v === "hard" || v === "soft" || v === "unlinked") {
    return "all";
  }

  return VALID_FILTERS.has(v ?? "") ? (v as SkillsFilter) : "all";
}

function initialFilterFromLegacyView(view?: string, type?: string): SkillsFilter {
  if (VALID_FILTERS.has(type ?? "")) {
    return type as SkillsFilter;
  }

  if (view === "active") return "active";
  if (view === "archive") return "archive";
  if (view === "development") return "development";

  return "all";
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function SkillTypeSection({
  emptyHelper,
  emptyTitle,
  icon,
  iconBg,
  skills,
  subtitle,
  title,
}: {
  emptyHelper: string;
  emptyTitle: string;
  icon: React.ReactNode;
  iconBg: string;
  skills: SkillWithActivities[];
  subtitle: string;
  title: string;
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-zinc-900/70 dark:shadow-none">
      <div className="mb-5 flex items-start gap-3">
        <div className={["grid h-9 w-9 shrink-0 place-items-center rounded-xl", iconBg].join(" ")}>
          {icon}
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">{title}</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>
        </div>
      </div>

      {skills.length > 0 ? (
        <div className="grid min-w-0 gap-3">
          {skills.map((skill) => (
            <SkillProductCard key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="mt-4 flex min-h-[120px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 px-4 py-6 text-center dark:border-white/10">
          <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">{emptyTitle}</p>
          <p className="mt-1 max-w-xs text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            {emptyHelper}
          </p>
          <div className="mt-4">
            <SkillCreateModal label="Добавить" />
          </div>
        </div>
      )}
    </section>
  );
}

function ActiveFilterBar({
  currentFilter,
}: {
  currentFilter: SkillsFilter;
}) {
  const filters: { label: string; value: SkillsFilter }[] = [
    { label: "Все", value: "all" },
    { label: "Активные", value: "active" },
    { label: "В развитии", value: "development" },
    { label: "Архив", value: "archive" },
  ];

  return (
    <nav aria-label="Фильтр навыков" className="flex flex-wrap gap-1">
      {filters.map((f) => {
        const isActive = currentFilter === f.value;
        return (
          <Link
            aria-current={isActive ? "true" : undefined}
            className={[
              "inline-flex h-8 items-center whitespace-nowrap rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/35",
              isActive
                ? "bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950"
                : "border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/5",
            ].join(" ")}
            href={`/skills?view=all&type=${f.value}`}
            key={f.value}
          >
            {f.label}
          </Link>
        );
      })}
    </nav>
  );
}

function PracticeWeekCard({
  skills,
  totalXp,
}: {
  skills: SkillWithActivities[];
  totalXp: number;
}) {
  const weeklyDone = skills.reduce(
    (sum, skill) =>
      sum + skill.linkedHabits.filter((habit) => habit.last_completed_at).length,
    0,
  );
  const activeWithProgress = skills.filter(
    (skill) => skill.computedProgress > 0 || skill.computedXp > 0,
  ).length;
  const strip = skills.slice(0, 8);

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/5 dark:bg-zinc-900/70">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
            Практика недели
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Регулярные действия, которые двигают навыки вперёд.
          </p>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-orange-200/70 bg-orange-50 text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400">
          <TrendingUp aria-hidden="true" size={18} />
        </span>
      </div>

      {skills.length > 0 && (weeklyDone > 0 || totalXp > 0 || activeWithProgress > 0) ? (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <DevStatCard icon={<Zap size={18} />} label="XP навыков" value={`${totalXp}`} />
            <DevStatCard icon={<Target size={18} />} label="практик за неделю" value={`${weeklyDone}`} />
            <DevStatCard icon={<TrendingUp size={18} />} label="в развитии" value={`${activeWithProgress}`} />
          </div>
          <div className="mt-5 grid gap-2">
            {strip.length > 0 ? (
              strip.map((skill) => (
                <div className="grid gap-2" key={skill.id}>
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="truncate font-semibold text-zinc-700 dark:text-zinc-300">
                      {skill.title}
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {skill.computedProgress}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#FF5A1F]"
                      style={{ width: `${Math.min(100, skill.computedProgress)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : null}
          </div>
        </>
      ) : (
        <div className="mt-5 flex min-h-[160px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 px-4 py-6 text-center dark:border-white/10">
          <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Практика появится после первых действий
          </p>
          <p className="mt-1 max-w-sm text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            Создайте навык и отметьте действие, чтобы увидеть динамику.
          </p>
          <div className="mt-4">
            <SkillCreateModal label="Создать навык" />
          </div>
        </div>
      )}
    </section>
  );
}

function SkillsEmptyState({
  description,
  icon,
  title,
}: {
  description: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-white/5 dark:bg-zinc-900/70">
      <div className="grid h-12 w-12 place-items-center rounded-2xl border border-zinc-200 bg-zinc-100 text-zinc-400 dark:border-white/10 dark:bg-zinc-950/45 dark:text-zinc-500">
        {icon}
      </div>
      <h2 className="mt-4 text-lg font-semibold text-zinc-950 dark:text-zinc-50">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <SkillCreateModal label="Создать навык" />
        <Link href="/skills?view=focus">
          <Button variant="secondary">Выбрать шаблон</Button>
        </Link>
      </div>
    </div>
  );
}

function DevStatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/5 dark:bg-zinc-900/70">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-white/10 dark:bg-zinc-950/45 dark:text-zinc-300">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-xl font-bold text-zinc-950 dark:text-zinc-50">{value}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

type SkillsPageProps = {
  searchParams: Promise<{ type?: string; view?: string }>;
};

export default async function SkillsPage({ searchParams }: SkillsPageProps) {
  const params = await searchParams;
  const view = parseView(params.view);
  const filterType = parseFilter(initialFilterFromLegacyView(params.view, params.type));

  const { supabase, user } = await getCurrentUser();
  let data: Awaited<ReturnType<typeof getSkillsBranchData>> | null = null;
  let loadError: string | null = null;

  if (supabase && user) {
    try {
      data = await getSkillsBranchData(supabase, user.id);
    } catch (error) {
      loadError = error instanceof Error ? error.message : "Не удалось загрузить навыки.";
    }
  }

  const activeSkills = data?.skills.filter((s) => s.status === "active") ?? [];
  const archivedSkills = data?.skills.filter((s) => s.status === "archived") ?? [];
  const hardSkills = activeSkills.filter(isHardSkill);
  const softSkills = activeSkills.filter((s) => !isHardSkill(s));

  const developmentSkills = activeSkills.filter(
    (s) => s.computedProgress > 0 || s.computedXp > 0 || s.linkedHabits.length > 0,
  );
  const filteredSkills =
    filterType === "archive"
      ? archivedSkills
      : filterType === "development"
        ? developmentSkills
        : filterType === "active"
          ? activeSkills
          : data?.skills ?? [];

  return (
    <PageContent aria-label="Навыки">
      <SkillsCreateAction />

      <div
        aria-label={`Активный раздел навыков: ${view}`}
        className="grid min-w-0 gap-5 xl:gap-6"
        role="tabpanel"
      >
        {loadError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            {loadError}
          </div>
        ) : null}

        {!data && !loadError ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-white/5 dark:bg-zinc-900/70">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Войдите, чтобы управлять навыками.
            </p>
          </div>
        ) : null}

        {data ? (
          <>
          {/* ─── ФОКУС ──────────────────────────────────────────────── */}
          {view === "focus" ? (
            <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-6 2xl:grid-cols-[minmax(0,1fr)_380px]">
              <main className="min-w-0 space-y-5 xl:space-y-6">
                <SkillsHero hero={data.hero} skills={activeSkills} />

                <section
                  aria-label="Категории навыков"
                  className="grid min-w-0 items-start gap-5 xl:grid-cols-2 xl:gap-6"
                >
                  <SkillTypeSection
                    emptyHelper="Добавьте технический навык, чтобы отслеживать практику и рост"
                    emptyTitle="Технических навыков пока нет"
                    icon={<Code2 className="text-violet-600 dark:text-violet-400" size={18} />}
                    iconBg="bg-violet-100 dark:bg-violet-500/10"
                    skills={hardSkills}
                    subtitle="Инструменты, технологии, языки"
                    title="Технические навыки"
                  />
                  <SkillTypeSection
                    emptyHelper="Добавьте гибкий навык, чтобы отслеживать коммуникацию, дисциплину и рост"
                    emptyTitle="Гибких навыков пока нет"
                    icon={<Brain className="text-rose-600 dark:text-rose-400" size={18} />}
                    iconBg="bg-rose-100 dark:bg-rose-500/10"
                    skills={softSkills}
                    subtitle="Фокус, дисциплина, коммуникация"
                    title="Гибкие навыки"
                  />
                </section>

                <PracticeWeekCard skills={activeSkills} totalXp={data.hero.totalXp} />
              </main>

              <aside className="min-w-0 self-start">
                <SkillsSidePanel />
              </aside>
            </div>
          ) : null}

          {/* ─── ВСЕ НАВЫКИ ─────────────────────────────────────────── */}
          {view === "all" ? (
            <div className="grid gap-5 xl:gap-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <ActiveFilterBar currentFilter={filterType} />
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {filteredSkills.length} навыков
                </p>
              </div>

              {filteredSkills.length === 0 ? (
                <SkillsEmptyState
                  description={
                    filterType === "archive"
                      ? "В архиве пока нет навыков."
                      : "Добавьте первый навык или выберите готовый шаблон, чтобы начать отслеживать развитие."
                  }
                  icon={
                    filterType === "archive" ? (
                      <FolderArchive aria-hidden="true" size={22} />
                    ) : (
                      <Target aria-hidden="true" size={24} />
                    )
                  }
                  title={
                    filterType === "archive"
                      ? "В архиве пока нет навыков"
                      : "Навыки пока не созданы"
                  }
                />
              ) : (
                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-white/5 dark:bg-zinc-900/70">
                  <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-5 py-4 dark:border-white/5">
                    <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                      Все навыки
                    </h2>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      {filteredSkills.length}
                    </span>
                  </div>
                  <div className="grid gap-3 p-3">
                    {filteredSkills.map((skill) => (
                      <SkillProductCard key={skill.id} skill={skill} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
          </>
        ) : null}
      </div>
    </PageContent>
  );
}
