"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Archive,
  Award,
  Calendar,
  Eye,
  Pencil,
  Plus,
  Shield,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react";

import { PageActionRegistration } from "@/components/layout/page-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ACHIEVEMENT_CATEGORY_LABELS,
  type AchievementsPageSummary,
  type EnrichedAchievement,
} from "@/lib/domain/achievements-page";
import { formatDate } from "@/lib/domain/labels";

type AchievementStatusFilter = "all" | "archived" | "in_progress" | "locked" | "unlocked";
type AchievementView = "all" | "personal" | "system";
type PersonalImportance = "ordinary" | "important" | "legendary";

type PersonalAchievement = {
  archived: boolean;
  category: string;
  date: string;
  description: string;
  id: string;
  importance: PersonalImportance;
  title: string;
};

type AchievementViewModel = {
  achievementXp: number;
  achievements: EnrichedAchievement[];
  archivedAchievements: PersonalAchievement[];
  featuredAchievement: FeaturedAchievement | null;
  inProgressAchievements: EnrichedAchievement[];
  inProgressCount: number;
  nearestAchievement: EnrichedAchievement | null;
  personalAchievements: PersonalAchievement[];
  personalCount: number;
  systemAchievements: EnrichedAchievement[];
  systemCount: number;
  totalCount: number;
  unlockedAchievements: EnrichedAchievement[];
  unlockedCount: number;
};

type FeaturedAchievement =
  | { kind: "system"; item: EnrichedAchievement; label: string; progress: number; status: string }
  | { kind: "personal"; item: PersonalAchievement; label: string; progress: number; status: string };

type AchievementsExperienceProps = {
  achievements: EnrichedAchievement[];
  nextAchievement: EnrichedAchievement | null;
  summary: AchievementsPageSummary;
};

const validStatusFilters = new Set<AchievementStatusFilter>([
  "all",
  "archived",
  "in_progress",
  "locked",
  "unlocked",
]);
const validViews = new Set<AchievementView>(["all", "personal", "system"]);

const importanceLabels: Record<PersonalImportance, string> = {
  important: "Важное",
  legendary: "Ключевое",
  ordinary: "Личное",
};

const achievementAccent = {
  bg: "bg-orange-50 dark:bg-[#FF5A1F]/10",
  border: "border-orange-200 dark:border-[#FF5A1F]/20",
  glow: "after:pointer-events-none after:absolute after:-right-20 after:-top-24 after:h-56 after:w-56 after:rounded-full after:bg-orange-200/35 after:blur-3xl dark:after:bg-[#FF5A1F]/[0.06]",
  icon: "border-orange-200 bg-orange-50 text-orange-700 dark:border-[#FF5A1F]/20 dark:bg-[#FF5A1F]/10 dark:text-[#FF5A1F]",
  line: "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-orange-500/40 before:via-orange-300/20 before:to-transparent dark:before:from-[#FF5A1F]/50 dark:before:via-[#FF5A1F]/20 dark:before:to-transparent",
  progress: "bg-[#FF5A1F]",
  status: "border-orange-200 bg-orange-50 text-orange-700 dark:border-[#FF5A1F]/20 dark:bg-[#FF5A1F]/10 dark:text-[#FF5A1F]",
  text: "text-orange-700 dark:text-[#FF5A1F]",
};

function parseView(value: string | null): AchievementView {
  return validViews.has(value as AchievementView) ? (value as AchievementView) : "all";
}

function parseStatusFilter(view: string | null, status: string | null): AchievementStatusFilter {
  if (validStatusFilters.has(status as AchievementStatusFilter)) {
    return status as AchievementStatusFilter;
  }

  if (view === "progress" || view === "in-progress") return "in_progress";
  if (view === "archive") return "archived";

  return "all";
}

function isPersonalSystemAchievement(achievement: EnrichedAchievement) {
  return (achievement as unknown as { importance?: string }).importance !== undefined;
}

function achievementProgress(achievement: EnrichedAchievement) {
  if (achievement.status === "unlocked") {
    return 100;
  }

  return Math.min(99, Math.max(0, achievement.progress?.percent ?? 0));
}

function buildAchievementViewModel(
  achievements: EnrichedAchievement[],
  personalAchievements: PersonalAchievement[],
  summary: AchievementsPageSummary,
  nextAchievement: EnrichedAchievement | null,
): AchievementViewModel {
  const activePersonal = personalAchievements.filter((achievement) => !achievement.archived);
  const archivedAchievements = personalAchievements.filter((achievement) => achievement.archived);
  const systemAchievements = achievements.filter((achievement) => !isPersonalSystemAchievement(achievement));
  const unlockedAchievements = achievements.filter((achievement) => achievement.status === "unlocked");
  const inProgressAchievements = achievements.filter((achievement) => {
    const progress = achievementProgress(achievement);
    return achievement.status !== "unlocked" && progress > 0 && progress < 100;
  });
  const nearestAchievement =
    nextAchievement && achievementProgress(nextAchievement) < 100 ? nextAchievement : null;
  const featuredUnlocked = [...unlockedAchievements].sort((a, b) => {
    const aTime = a.unlocked_at ? new Date(a.unlocked_at).getTime() : 0;
    const bTime = b.unlocked_at ? new Date(b.unlocked_at).getTime() : 0;
    return bTime - aTime;
  })[0];
  const featuredPersonal = activePersonal[0] ?? null;
  const featuredAchievement: FeaturedAchievement | null = featuredUnlocked
    ? {
        item: featuredUnlocked,
        kind: "system",
        label: "Открытое достижение",
        progress: 100,
        status: "Открыто",
      }
    : nearestAchievement
    ? {
        item: nearestAchievement,
        kind: "system",
        label: "Ближайшее достижение",
        progress: achievementProgress(nearestAchievement),
        status: "В процессе",
      }
    : featuredPersonal
    ? {
        item: featuredPersonal,
        kind: "personal",
        label: "Личное достижение",
        progress: 100,
        status: "Личное",
      }
    : null;

  return {
    achievementXp: summary.xpFromAchievements,
    achievements,
    archivedAchievements,
    featuredAchievement,
    inProgressAchievements,
    inProgressCount: inProgressAchievements.length,
    nearestAchievement,
    personalAchievements: activePersonal,
    personalCount: activePersonal.length,
    systemAchievements,
    systemCount: systemAchievements.length,
    totalCount: achievements.length + activePersonal.length + archivedAchievements.length,
    unlockedAchievements,
    unlockedCount: unlockedAchievements.length + activePersonal.length,
  };
}

function panelClass(className = "") {
  return [
    "relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 text-zinc-950 shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-white/5 dark:bg-zinc-900/70 dark:text-zinc-50",
    className,
  ].join(" ");
}

function accentLineClass() {
  return achievementAccent.line;
}

function accentGlowClass() {
  return achievementAccent.glow;
}

function IconBadge({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  return (
    <span
      className={[
        "grid h-10 w-10 shrink-0 place-items-center rounded-2xl border",
        muted
          ? "border-zinc-200 bg-zinc-100 text-zinc-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-500"
          : achievementAccent.icon,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  const normalized = Math.min(100, Math.max(0, value));
  return (
    <div
      aria-label={`Прогресс ${normalized}%`}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={normalized}
      className="h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10"
      role="progressbar"
    >
      <div
        className={["h-full rounded-full", achievementAccent.progress].join(" ")}
        style={{ width: `${normalized}%` }}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: "archive" | "locked" | "progress" | "unlocked" }) {
  const classes = {
    archive: "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400",
    locked: "border-zinc-200 bg-zinc-100 text-zinc-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-500",
    progress: achievementAccent.status,
    unlocked: "border-orange-200 bg-orange-50 text-orange-700 dark:border-[#FF5A1F]/20 dark:bg-[#FF5A1F]/10 dark:text-[#FF5A1F]",
  };
  const labels = {
    archive: "Архив",
    locked: "Скрыто",
    progress: "В процессе",
    unlocked: "Открыто",
  };

  return (
    <span className={["inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold", classes[status]].join(" ")}>
      {labels[status]}
    </span>
  );
}

function EmptyState({
  action,
  description,
  icon,
  title,
}: {
  action?: ReactNode;
  description: string;
  icon: ReactNode;
  title: string;
}) {
  return (
    <div className={panelClass("grid min-h-[260px] place-items-center")}>
      <div className="flex max-w-md flex-col items-center text-center">
        <IconBadge>{icon}</IconBadge>
        <p className="mt-4 text-base font-semibold text-zinc-950 dark:text-zinc-50">{title}</p>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{description}</p>
        {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
      </div>
    </div>
  );
}

function AddAchievementButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      className="h-10 w-full rounded-xl bg-primary px-4 text-sm text-white hover:bg-[var(--primary-hover)] sm:w-auto"
      onClick={onClick}
      type="button"
    >
      <Plus size={16} />
      Добавить достижение
    </Button>
  );
}

function FeaturedAchievementCard({ featured }: { featured: FeaturedAchievement | null }) {
  if (!featured) {
    return (
      <EmptyState
        action={
          <Link href="/habits">
            <Button size="sm" variant="secondary">Перейти к привычкам</Button>
          </Link>
        }
        description="Откроются после выполнения привычек и целей. Здесь появится ближайшая или недавно открытая награда."
        icon={<Trophy size={22} />}
        title="Пока нет достижений"
      />
    );
  }

  const isPersonal = featured.kind === "personal";
  const title = isPersonal ? featured.item.title : featured.item.title;
  const description = isPersonal
    ? featured.item.description || "Личная победа, добавленная вручную."
    : featured.item.conditionText;
  const moduleLabel = isPersonal ? featured.item.category : ACHIEVEMENT_CATEGORY_LABELS[featured.item.category];
  const xpReward = isPersonal ? 0 : featured.item.xp_reward;

  return (
    <section className={panelClass(`${accentLineClass()} ${accentGlowClass()} grid gap-5 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-center`)}>
      <div className="flex min-w-0 gap-4">
        <IconBadge>
          <Trophy size={22} />
        </IconBadge>
        <div className="min-w-0">
          <p className={["text-xs font-semibold uppercase tracking-[0.16em]", achievementAccent.text].join(" ")}>
            {featured.label}
          </p>
          <h2 className="mt-2 line-clamp-2 break-words text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            {title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
            <span>{isPersonal ? "Личное" : "Системное"}</span>
            <span>·</span>
            <span>{moduleLabel}</span>
            <span>·</span>
            <span>{xpReward > 0 ? `+${xpReward} XP` : "Без XP"}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        <StatusBadge status={featured.progress >= 100 ? "unlocked" : "progress"} />
        <ProgressBar value={featured.progress} />
        <p className={["text-sm font-semibold", achievementAccent.text].join(" ")}>
          {featured.progress}% · {featured.status}
        </p>
      </div>
    </section>
  );
}

function StatCard({
  helper,
  icon,
  label,
  value,
}: {
  helper?: string;
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className={panelClass("flex items-center gap-3 p-4")}>
      <IconBadge>{icon}</IconBadge>
      <div className="min-w-0">
        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">{value}</p>
        {helper ? <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">{helper}</p> : null}
      </div>
    </div>
  );
}

function SummaryStats({ viewModel }: { viewModel: AchievementViewModel }) {
  const emptyHelper = viewModel.totalCount === 0 ? "Откроются после выполнения привычек и целей" : undefined;

  return (
    <section className="grid grid-cols-2 gap-5 xl:grid-cols-6 xl:gap-6">
      <StatCard helper={emptyHelper} icon={<Trophy size={18} />} label="Всего" value={viewModel.totalCount} />
      <StatCard icon={<Award size={18} />} label="Открыто" value={viewModel.unlockedCount} />
      <StatCard icon={<Zap size={18} />} label="В процессе" value={viewModel.inProgressCount} />
      <StatCard icon={<Star size={18} />} label="Личные" value={viewModel.personalCount} />
      <StatCard icon={<Shield size={18} />} label="Системные" value={viewModel.systemCount} />
      <StatCard icon={<Sparkles size={18} />} label="XP" value={viewModel.achievementXp} />
    </section>
  );
}

function SystemAchievementCard({ achievement }: { achievement: EnrichedAchievement }) {
  const progress = achievementProgress(achievement);
  const isUnlocked = achievement.status === "unlocked";
  const inProgress = !isUnlocked && progress > 0 && progress < 100;

  return (
    <article className={panelClass(`${isUnlocked ? `${accentLineClass()} ${accentGlowClass()}` : ""} grid gap-4 ${!isUnlocked ? "opacity-85" : ""}`)}>
      <div className="flex items-start gap-3">
        <IconBadge muted={!isUnlocked && !inProgress}>
          <Trophy size={18} />
        </IconBadge>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 break-words text-base font-semibold text-zinc-950 dark:text-zinc-50">
            {achievement.title}
          </h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {ACHIEVEMENT_CATEGORY_LABELS[achievement.category]} · +{achievement.xp_reward} XP
          </p>
        </div>
        <StatusBadge status={isUnlocked ? "unlocked" : inProgress ? "progress" : "locked"} />
      </div>

      <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">{achievement.conditionText}</p>
      <div className="grid gap-2">
        <ProgressBar value={progress} />
        <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
          <span>{progress}%</span>
          <span>{achievement.progress ? `${achievement.progress.current} / ${achievement.progress.target}` : "Нет прогресса"}</span>
        </div>
      </div>
      <Link href={achievement.ctaHref}>
        <Button aria-label={`${achievement.ctaLabel}: ${achievement.title}`} size="sm" variant="secondary">
          {achievement.ctaLabel}
        </Button>
      </Link>
    </article>
  );
}

function PersonalAchievementCard({
  achievement,
  onArchive,
  onEdit,
}: {
  achievement: PersonalAchievement;
  onArchive: (id: string) => void;
  onEdit: (achievement: PersonalAchievement) => void;
}) {
  return (
    <article className={panelClass(`${achievement.archived ? "opacity-75" : `${accentLineClass()} ${accentGlowClass()}`} grid gap-4`)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <IconBadge muted={achievement.archived}>
            <Star size={18} />
          </IconBadge>
          <div className="min-w-0">
            <h3 className="line-clamp-2 break-words text-base font-semibold text-zinc-950 dark:text-zinc-50">
              {achievement.title}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {achievement.category} · {importanceLabels[achievement.importance]}
            </p>
          </div>
        </div>
        <StatusBadge status={achievement.archived ? "archive" : "unlocked"} />
      </div>
      {achievement.description ? (
        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">{achievement.description}</p>
      ) : null}
      <p className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
        <Calendar size={13} />
        {formatDate(achievement.date)}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button aria-label={`Открыть ${achievement.title}`} size="sm" variant="secondary">
          <Eye size={14} />
          Открыть
        </Button>
        {!achievement.archived ? (
          <>
            <Button onClick={() => onEdit(achievement)} size="sm" type="button" variant="secondary">
              <Pencil size={14} />
              Редактировать
            </Button>
            <Button onClick={() => onArchive(achievement.id)} size="sm" type="button" variant="secondary">
              <Archive size={14} />
              Архивировать
            </Button>
          </>
        ) : null}
      </div>
    </article>
  );
}

function statusOfSystemAchievement(achievement: EnrichedAchievement): AchievementStatusFilter {
  if (achievement.status === "unlocked") return "unlocked";

  const progress = achievementProgress(achievement);
  return progress > 0 && progress < 100 ? "in_progress" : "locked";
}

function statusOfPersonalAchievement(achievement: PersonalAchievement): AchievementStatusFilter {
  return achievement.archived ? "archived" : "unlocked";
}

function StatusFilterChips({
  activeStatus,
  view,
}: {
  activeStatus: AchievementStatusFilter;
  view: AchievementView;
}) {
  const filters: Array<{ label: string; value: AchievementStatusFilter }> = [
    { label: "Все статусы", value: "all" },
    { label: "Открыто", value: "unlocked" },
    { label: "В процессе", value: "in_progress" },
    { label: "Скрыто", value: "locked" },
    { label: "Архив", value: "archived" },
  ];

  return (
    <nav
      aria-label="Фильтр статуса достижений"
      className="min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex min-w-max gap-2">
        {filters.map((filter) => {
          const active = activeStatus === filter.value;

          return (
            <Link
              aria-current={active ? "true" : undefined}
              className={[
                "inline-flex h-8 items-center rounded-full border px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30",
                active
                  ? "border-orange-200 bg-orange-50 text-orange-700 dark:border-[#FF5A1F]/20 dark:bg-[#FF5A1F]/10 dark:text-[#FF5A1F]"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-orange-200 hover:text-orange-700 dark:border-white/10 dark:bg-zinc-900/70 dark:text-zinc-400 dark:hover:border-[#FF5A1F]/20 dark:hover:text-[#FF5A1F]",
              ].join(" ")}
              href={`/achievements?view=${view}&status=${filter.value}`}
              key={filter.value}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function achievementEmptyCopy(view: AchievementView, status: AchievementStatusFilter) {
  if (status === "archived") {
    return {
      description: "Скрытые или завершённые личные достижения будут появляться здесь.",
      icon: <Archive size={22} />,
      title: "В архиве пока нет достижений",
    };
  }

  if (status === "in_progress") {
    return {
      description: "Выполняйте привычки и цели, чтобы появились ближайшие награды.",
      icon: <Zap size={22} />,
      title: "Достижений в процессе пока нет",
    };
  }

  if (view === "personal") {
    return {
      description: "Добавьте личную победу: первый клиент, закрытый проект, выступление, переезд или другой важный результат.",
      icon: <Star size={22} />,
      title: "Личных достижений пока нет",
    };
  }

  if (view === "system") {
    return {
      description: "Системные награды Lifera появятся после выполнения привычек, целей и накопления прогресса.",
      icon: <Shield size={22} />,
      title: "Системные достижения пока не найдены",
    };
  }

  return {
    description: "Выполняйте привычки и цели, чтобы появились первые системные и личные награды.",
    icon: <Trophy size={22} />,
    title: "Достижений пока нет",
  };
}

function FilteredAchievementsGrid({
  items,
  onAdd,
  onArchive,
  onEdit,
  status,
  view,
}: {
  items: Array<{ kind: "personal"; item: PersonalAchievement } | { kind: "system"; item: EnrichedAchievement }>;
  onAdd: () => void;
  onArchive: (id: string) => void;
  onEdit: (achievement: PersonalAchievement) => void;
  status: AchievementStatusFilter;
  view: AchievementView;
}) {
  if (items.length === 0) {
    const copy = achievementEmptyCopy(view, status);
    const action =
      view === "personal" && status !== "archived" ? (
        <AddAchievementButton onClick={onAdd} />
      ) : status === "archived" ? (
        <Link href={`/achievements?view=${view}&status=all`}>
          <Button size="sm" variant="secondary">Показать все</Button>
        </Link>
      ) : (
        <Link href="/habits">
          <Button size="sm" variant="secondary">Открыть привычки</Button>
        </Link>
      );

    return (
      <EmptyState
        action={action}
        description={copy.description}
        icon={copy.icon}
        title={copy.title}
      />
    );
  }

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
      {items.map((entry) =>
        entry.kind === "system" ? (
          <SystemAchievementCard achievement={entry.item} key={`system-${entry.item.id}`} />
        ) : (
          <PersonalAchievementCard
            achievement={entry.item}
            key={`personal-${entry.item.id}`}
            onArchive={onArchive}
            onEdit={onEdit}
          />
        ),
      )}
    </section>
  );
}

function CreateAchievementModal({
  initialAchievement,
  onClose,
  onSave,
}: {
  initialAchievement: PersonalAchievement | null;
  onClose: () => void;
  onSave: (achievement: PersonalAchievement) => void;
}) {
  const [form, setForm] = useState({
    category: initialAchievement?.category ?? "Карьера",
    date: initialAchievement?.date ?? new Date().toISOString().slice(0, 10),
    description: initialAchievement?.description ?? "",
    importance: initialAchievement?.importance ?? "ordinary",
    title: initialAchievement?.title ?? "",
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    onSave({
      archived: initialAchievement?.archived ?? false,
      category: form.category,
      date: form.date,
      description: form.description.trim(),
      id: initialAchievement?.id ?? `local-${Date.now()}`,
      importance: form.importance,
      title: form.title.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/60 p-4 sm:place-items-center">
      <button aria-label="Закрыть модальное окно" className="absolute inset-0" onClick={onClose} type="button" />
      <div className={panelClass("relative z-10 w-full max-w-lg")}>
        <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          {initialAchievement ? "Редактировать достижение" : "Новое личное достижение"}
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Системные достижения Lifera добавляет автоматически. Здесь фиксируются личные победы.
        </p>
        <form className="mt-5 grid gap-4" onSubmit={submit}>
          <Input
            label="Название"
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Первый клиент"
            required
            value={form.title}
          />
          <Textarea
            label="Описание"
            onChange={(event) =>
              setForm((current) => ({ ...current, description: event.target.value }))
            }
            placeholder="Коротко зафиксируйте контекст."
            value={form.description}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Дата"
              onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
              required
              type="date"
              value={form.date}
            />
            <Select
              label="Категория"
              onChange={(event) =>
                setForm((current) => ({ ...current, category: event.target.value }))
              }
              value={form.category}
            >
              <option>Карьера</option>
              <option>Проект</option>
              <option>Обучение</option>
              <option>Финансы</option>
              <option>Здоровье</option>
              <option>Личная жизнь</option>
            </Select>
          </div>
          <Select
            label="Значимость"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                importance: event.target.value as PersonalImportance,
              }))
            }
            value={form.importance}
          >
            <option value="ordinary">Личное</option>
            <option value="important">Важное</option>
            <option value="legendary">Ключевое</option>
          </Select>
          <div className="mt-2 flex justify-end gap-3">
            <Button onClick={onClose} type="button" variant="secondary">
              Отмена
            </Button>
            <Button className="bg-primary text-white hover:bg-[var(--primary-hover)]" type="submit">
              Сохранить достижение
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AchievementsExperience({
  achievements,
  nextAchievement,
  summary,
}: AchievementsExperienceProps) {
  const searchParams = useSearchParams();
  const activeView = parseView(searchParams.get("view"));
  const activeStatus = parseStatusFilter(searchParams.get("view"), searchParams.get("status"));
  const [personalAchievements, setPersonalAchievements] = useState<PersonalAchievement[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<PersonalAchievement | null>(null);
  const viewModel = useMemo(
    () => buildAchievementViewModel(achievements, personalAchievements, summary, nextAchievement),
    [achievements, nextAchievement, personalAchievements, summary],
  );

  function openCreate() {
    setEditingAchievement(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingAchievement(null);
  }

  function savePersonalAchievement(achievement: PersonalAchievement) {
    setPersonalAchievements((current) => {
      const exists = current.some((item) => item.id === achievement.id);
      if (exists) {
        return current.map((item) => (item.id === achievement.id ? achievement : item));
      }
      return [achievement, ...current];
    });
    closeModal();
  }

  function archivePersonalAchievement(id: string) {
    setPersonalAchievements((current) =>
      current.map((achievement) =>
        achievement.id === id ? { ...achievement, archived: true } : achievement,
      ),
    );
  }

  const addAction = <AddAchievementButton onClick={openCreate} />;
  const filteredItems = useMemo(() => {
    const systemItems =
      activeView === "personal"
        ? []
        : viewModel.systemAchievements.map((item) => ({ item, kind: "system" as const }));
    const personalItems =
      activeView === "system"
        ? []
        : [...viewModel.personalAchievements, ...viewModel.archivedAchievements].map((item) => ({
            item,
            kind: "personal" as const,
          }));

    return [...systemItems, ...personalItems].filter((entry) => {
      if (activeStatus === "all") return true;

      const status =
        entry.kind === "system"
          ? statusOfSystemAchievement(entry.item)
          : statusOfPersonalAchievement(entry.item);

      return status === activeStatus;
    });
  }, [
    activeStatus,
    activeView,
    viewModel.archivedAchievements,
    viewModel.personalAchievements,
    viewModel.systemAchievements,
  ]);

  return (
    <>
      <PageActionRegistration actions={addAction} />
      <div className="grid gap-5 xl:gap-6" role="tabpanel">
        <FeaturedAchievementCard featured={viewModel.featuredAchievement} />
        <SummaryStats viewModel={viewModel} />
        <StatusFilterChips activeStatus={activeStatus} view={activeView} />
        <FilteredAchievementsGrid
          items={filteredItems}
          onAdd={openCreate}
          onArchive={archivePersonalAchievement}
          onEdit={(achievement) => {
            setEditingAchievement(achievement);
            setModalOpen(true);
          }}
          status={activeStatus}
          view={activeView}
        />
      </div>

      {modalOpen ? (
        <CreateAchievementModal
          initialAchievement={editingAchievement}
          onClose={closeModal}
          onSave={savePersonalAchievement}
        />
      ) : null}
    </>
  );
}
