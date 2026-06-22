"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CheckCircle,
  Coins,
  Dumbbell,
  Home,
  Laptop,
  Link as LinkIcon,
  MoreHorizontal,
  Plane,
  Plus,
  RefreshCw,
  Shirt,
  Sparkles,
  Star,
  Target,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageActionRegistration } from "@/components/layout/page-actions";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast-provider";
import type { Wish } from "@/lib/domain/types";
import type { WishGoalOption } from "@/lib/domain/wishes-page";
import { handleMutationError, showMutationSuccess } from "@/lib/ui/feedback";

type WishesBoardProps = {
  acquiredCount: number;
  goals: WishGoalOption[];
  primaryWish: Wish | null;
  wishes: Wish[];
};

type EditingWish = Wish | null;
type WishFilter = "all" | "wanted" | "in_progress" | "acquired" | "archived";

const defaultCategories = [
  "Гаджеты",
  "Одежда",
  "Путешествия",
  "Дом",
  "Обучение",
  "Здоровье",
  "Опыт",
];

function formatAmount(value: number | null | undefined) {
  const amount = Number(value ?? 0);
  if (!amount) return null;
  return new Intl.NumberFormat("ru-RU", {
    currency: "RUB",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}

function wishProgress(wish: Wish) {
  const target = Number(wish.target_amount ?? 0);
  const current = Number(wish.current_amount ?? 0);
  return target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
}

function visualStatus(wish: Wish): WishFilter {
  if (wish.status === "archived") return "archived";
  if (wish.status === "acquired") return "acquired";
  if (Number(wish.current_amount ?? 0) > 0) return "in_progress";
  return "wanted";
}

function statusLabel(status: WishFilter) {
  if (status === "acquired") return "Приобретено";
  if (status === "archived") return "Архив";
  if (status === "in_progress") return "В процессе";
  return "Хочу";
}

function statusClasses(status: WishFilter) {
  if (status === "acquired")
    return "bg-emerald-100 text-emerald-700 dark:bg-green-500/20 dark:text-green-400";
  if (status === "archived")
    return "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400";
  if (status === "in_progress")
    return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
  return "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400";
}

function categoryIcon(
  category?: string | null,
  className = "text-zinc-500 dark:text-zinc-400",
  size = 14,
) {
  const normalized = (category ?? "").toLowerCase();
  if (normalized.includes("одеж")) return <Shirt className={className} size={size} />;
  if (normalized.includes("путеше")) return <Plane className={className} size={size} />;
  if (normalized.includes("дом")) return <Home className={className} size={size} />;
  if (normalized.includes("обуч")) return <BookOpen className={className} size={size} />;
  if (normalized.includes("здоров")) return <Dumbbell className={className} size={size} />;
  if (normalized.includes("опыт")) return <Sparkles className={className} size={size} />;
  return <Laptop className={className} size={size} />;
}

function goalTitle(goals: WishGoalOption[], id: string | null) {
  return goals.find((goal) => goal.id === id)?.title ?? null;
}

export function WishesBoard({
  acquiredCount,
  goals,
  primaryWish,
  wishes,
}: WishesBoardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [editing, setEditing] = useState<EditingWish>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<WishFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const activeWishes = wishes.filter((wish) => wish.status !== "archived");
  const linkedCount = activeWishes.filter((wish) => wish.linked_goal_id).length;
  const unlinkedWishes = activeWishes.filter((wish) => !wish.linked_goal_id).slice(0, 3);
  const totalAmount = activeWishes.reduce(
    (sum, wish) => sum + Number(wish.target_amount ?? 0),
    0,
  );
  const inProgressAmount = activeWishes
    .filter((wish) => visualStatus(wish) === "in_progress")
    .reduce((sum, wish) => sum + Number(wish.current_amount ?? 0), 0);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const category of defaultCategories) map.set(category, 0);
    for (const wish of wishes) {
      const category = wish.category?.trim() || "Гаджеты";
      map.set(category, (map.get(category) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([name, count]) => ({ count, name }));
  }, [wishes]);

  const statusCounts = useMemo(
    () => ({
      acquired: wishes.filter((wish) => visualStatus(wish) === "acquired").length,
      archived: wishes.filter((wish) => visualStatus(wish) === "archived").length,
      in_progress: wishes.filter((wish) => visualStatus(wish) === "in_progress").length,
      wanted: wishes.filter((wish) => visualStatus(wish) === "wanted").length,
    }),
    [wishes],
  );

  const goalLinks = goals
    .map((goal) => ({
      count: wishes.filter((wish) => wish.linked_goal_id === goal.id).length,
      goal,
    }))
    .filter((item) => item.count > 0)
    .slice(0, 4);

  const filteredWishes = wishes.filter((wish) => {
    if (statusFilter !== "all" && visualStatus(wish) !== statusFilter) return false;
    if (categoryFilter && (wish.category?.trim() || "Гаджеты") !== categoryFilter) return false;
    return statusFilter === "archived" ? true : wish.status !== "archived";
  });

  function openCreateModal() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEditModal(wish: Wish) {
    setEditing(wish);
    setModalOpen(true);
  }

  async function makePrimary(wishId: string) {
    const response = await fetch(`/api/wishes/${wishId}/primary`, { method: "PUT" });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      handleMutationError(toast, payload, "Не удалось обновить главное желание.");
      return;
    }
    showMutationSuccess(toast, "Главное желание обновлено");
    router.refresh();
  }

  return (
    <>
      <PageActionRegistration
        actions={
          <Button
            className="h-11 w-full rounded-xl bg-primary px-6 text-base text-white hover:bg-[var(--primary-hover)] sm:w-auto"
            onClick={openCreateModal}
            type="button"
          >
            <Plus aria-hidden="true" size={18} />
            Добавить желание
          </Button>
        }
      />

      {wishes.length === 0 ? (
        <MainEmptyState onAdd={openCreateModal} />
      ) : (
        <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid min-w-0 w-full content-start gap-5 xl:gap-6">
            <StatsRow
              acquiredCount={acquiredCount}
              inProgressAmount={inProgressAmount}
              linkedCount={linkedCount}
              totalAmount={totalAmount}
              totalCount={activeWishes.length}
            />

            <PrimaryWishHero
              goals={goals}
              onEdit={openEditModal}
              onMakePrimary={makePrimary}
              primaryWish={primaryWish}
              suggestedWishes={activeWishes.filter((w) => !w.is_primary).slice(0, 3)}
            />

            <div>
              <h2 className="text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                Желания
              </h2>
              <div
                aria-label="Фильтр по статусу"
                className="mt-3 flex flex-wrap gap-2"
                role="group"
              >
                {(
                  [
                    ["all", "Все"],
                    ["wanted", "Хочу"],
                    ["in_progress", "В процессе"],
                    ["acquired", "Приобретено"],
                    ["archived", "Архив"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    aria-pressed={statusFilter === value}
                    className={[
                      "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
                      statusFilter === value
                        ? "border-primary bg-primary/10 text-primary dark:bg-primary/15"
                        : "border-zinc-200 bg-zinc-100 text-zinc-600 hover:text-zinc-900 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50",
                    ].join(" ")}
                    key={value}
                    onClick={() => setStatusFilter(value)}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {filteredWishes.length > 0 ? (
              <div className="grid auto-rows-fr gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {filteredWishes.map((wish) => (
                  <WishCard
                    goals={goals}
                    key={wish.id}
                    onEdit={() => openEditModal(wish)}
                    wish={wish}
                  />
                ))}
              </div>
            ) : (
              <FilteredEmptyState
                categoryFilter={categoryFilter}
                onReset={() => {
                  setStatusFilter("all");
                  setCategoryFilter(null);
                }}
                statusFilter={statusFilter}
              />
            )}
          </div>

          <div className="min-w-0 w-full xl:max-w-[340px] xl:justify-self-end 2xl:max-w-[360px]">
            <WishesSidebar
              categories={categories}
              categoryFilter={categoryFilter}
              goalLinks={goalLinks}
              onCategoryChange={setCategoryFilter}
              onEditWish={openEditModal}
              onStatusChange={setStatusFilter}
              statusCounts={statusCounts}
              statusFilter={statusFilter}
              unlinkedWishes={unlinkedWishes}
            />
          </div>
        </div>
      )}

      {modalOpen ? (
        <WishModal
          goals={goals}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          wish={editing}
        />
      ) : null}
    </>
  );
}

function MainEmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-white/5 dark:bg-zinc-900/70">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-zinc-200 bg-zinc-100 text-primary dark:border-white/10 dark:bg-zinc-950/45">
        <Star aria-hidden="true" size={26} />
      </div>
      <h2 className="mt-5 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
        Карта желаний пока пуста
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        Добавьте первое желание и свяжите его с целью — так цель получит понятный мотивационный
        слой.
      </p>
      <button
        className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
        onClick={onAdd}
        type="button"
      >
        <Plus aria-hidden="true" size={16} />
        Добавить желание
      </button>
    </div>
  );
}

function FilteredEmptyState({
  categoryFilter,
  onReset,
  statusFilter,
}: {
  categoryFilter: string | null;
  onReset: () => void;
  statusFilter: WishFilter;
}) {
  const message = categoryFilter
    ? `В категории «${categoryFilter}» пока нет желаний`
    : statusFilter !== "all"
      ? "В этом статусе пока нет желаний"
      : "Желания не найдены";

  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-white/5 dark:bg-zinc-900/40">
      <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">{message}</p>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Измените фильтр или добавьте новое желание.
      </p>
      <button
        className="mt-4 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 dark:border-white/10 dark:bg-zinc-950/45 dark:text-zinc-100 dark:hover:bg-white/10"
        onClick={onReset}
        type="button"
      >
        Сбросить фильтры
      </button>
    </div>
  );
}

function StatsRow({
  acquiredCount,
  inProgressAmount,
  linkedCount,
  totalAmount,
  totalCount,
}: {
  acquiredCount: number;
  inProgressAmount: number;
  linkedCount: number;
  totalAmount: number;
  totalCount: number;
}) {
  const items = [
    { icon: <Sparkles size={18} />, label: "желаний", value: totalCount },
    {
      icon: <Coins size={18} />,
      label: "общая сумма",
      value: formatAmount(totalAmount) ?? "0 ₽",
    },
    {
      icon: <RefreshCw size={18} />,
      label: "в процессе",
      value: formatAmount(inProgressAmount) ?? "0 ₽",
    },
    { icon: <CheckCircle size={18} />, label: "приобретено", value: acquiredCount },
    {
      icon: <LinkIcon size={18} />,
      label: "связаны с целями",
      value: `${linkedCount} из ${totalCount}`,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
      {items.map((item) => (
        <div
          className="flex min-w-0 items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-white/5 dark:bg-zinc-900/70"
          key={item.label}
        >
          <span className="shrink-0 text-primary">{item.icon}</span>
          <div className="min-w-0">
            <p className="truncate text-xl font-bold text-zinc-950 dark:text-zinc-50">
              {item.value}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function PrimaryWishHero({
  goals,
  onEdit,
  onMakePrimary,
  primaryWish,
  suggestedWishes,
}: {
  goals: WishGoalOption[];
  onEdit: (wish: Wish) => void;
  onMakePrimary: (wishId: string) => Promise<void>;
  primaryWish: Wish | null;
  suggestedWishes: Wish[];
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleMakePrimary(wish: Wish) {
    setLoadingId(wish.id);
    await onMakePrimary(wish.id);
    setLoadingId(null);
  }

  if (!primaryWish) {
    // State B: wishes exist but no primary selected
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/5 dark:bg-zinc-900/70">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-zinc-200 bg-zinc-100 text-primary dark:border-white/10 dark:bg-zinc-950/45">
            <Star aria-hidden="true" size={17} />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              Выберите главное желание
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Главное желание станет мотивационным фокусом на дашборде.
            </p>
          </div>
        </div>
        {suggestedWishes.length > 0 ? (
          <div className="mt-4 grid gap-2">
            {suggestedWishes.map((wish) => (
              <div
                className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-white/5 dark:bg-zinc-950/35"
                key={wish.id}
              >
                <div className="min-w-0">
                  <p className="line-clamp-1 text-sm font-medium text-zinc-950 dark:text-zinc-50">
                    {wish.title}
                  </p>
                  {wish.category ? (
                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-500">
                      {wish.category}
                    </p>
                  ) : null}
                </div>
                <button
                  className="shrink-0 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 disabled:opacity-60 dark:border-white/10 dark:bg-zinc-950/45 dark:text-zinc-100 dark:hover:bg-white/10"
                  disabled={loadingId === wish.id}
                  onClick={() => handleMakePrimary(wish)}
                  type="button"
                >
                  {loadingId === wish.id ? "..." : "Сделать главным"}
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  // State C: primary wish selected
  const progress = wishProgress(primaryWish);
  const amount = formatAmount(primaryWish.target_amount);
  const linkedGoal = goalTitle(goals, primaryWish.linked_goal_id);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-orange-200/60 bg-orange-50/40 p-5 dark:border-primary/20 dark:bg-zinc-900/70">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary/60 via-primary/25 to-transparent"
      />
      <div className="relative grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-primary">
            Главное желание <Star aria-hidden="true" size={13} />
          </p>
          <h2 className="mt-2 line-clamp-2 break-words text-lg font-semibold leading-tight text-zinc-950 dark:text-zinc-50 sm:text-xl">
            {primaryWish.title}
          </h2>
          {amount ? <p className="mt-1 text-base font-semibold text-primary">{amount}</p> : null}
          <div className="mt-3 max-w-sm">
            <div className="mb-1.5 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
              <span>{progress}% к цели</span>
            </div>
            <ProgressBar value={progress} />
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-600 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <Target aria-hidden="true" className="text-zinc-400 dark:text-zinc-500" size={13} />
              {linkedGoal ?? "Без цели"}
            </span>
            <span
              className={[
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                statusClasses(visualStatus(primaryWish)),
              ].join(" ")}
            >
              {statusLabel(visualStatus(primaryWish))}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
          <button
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
            onClick={() => onEdit(primaryWish)}
            type="button"
          >
            Редактировать
          </button>
          <button
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 dark:border-white/15 dark:bg-zinc-900/70 dark:text-zinc-100 dark:hover:bg-zinc-800"
            onClick={() => onEdit(primaryWish)}
            type="button"
          >
            Изменить главное
          </button>
        </div>
      </div>
    </div>
  );
}

function WishCard({
  goals,
  onEdit,
  wish,
}: {
  goals: WishGoalOption[];
  onEdit: () => void;
  wish: Wish;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const linkedGoal = goalTitle(goals, wish.linked_goal_id);
  const amount = formatAmount(wish.target_amount);
  const progress = wishProgress(wish);
  const status = visualStatus(wish);
  const image = wish.image_url;

  async function mutate(action: "archive" | "primary" | "acquired") {
    setLoading(true);
    setMenuOpen(false);

    const response =
      action === "primary"
        ? await fetch(`/api/wishes/${wish.id}/primary`, { method: "PUT" })
        : action === "archive"
          ? await fetch(`/api/wishes/${wish.id}`, { method: "DELETE" })
          : await fetch(`/api/wishes/${wish.id}`, {
              body: JSON.stringify({ ...wish, status: "acquired" }),
              headers: { "Content-Type": "application/json" },
              method: "PUT",
            });

    const payload = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      handleMutationError(toast, payload, "Не удалось обновить желание.");
      return;
    }

    showMutationSuccess(toast, "Карта желаний обновлена");
    router.refresh();
  }

  return (
    <div className="h-full overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-white/5 dark:bg-zinc-900/70">
      <div className="relative h-36 overflow-hidden bg-[linear-gradient(135deg,rgba(255,90,31,0.4),rgba(24,24,27,1))]">
        {image ? (
          <div
            aria-hidden="true"
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
        ) : (
          <div className="grid h-full place-items-center">
            {categoryIcon(wish.category, "text-white/60", 40)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        <div className="absolute right-2 top-2">
          <button
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label="Действия с желанием"
            className="grid h-8 w-8 place-items-center rounded-full bg-black/45 text-white backdrop-blur"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            <MoreHorizontal size={18} />
          </button>
          {menuOpen ? (
            <div className="absolute right-0 top-full z-20 mt-2 min-w-48 rounded-xl border border-zinc-200 bg-white p-1 shadow-[var(--shadow-md)] dark:border-white/10 dark:bg-zinc-900">
              {!wish.is_primary && wish.status !== "archived" ? (
                <MenuButton disabled={loading} onClick={() => mutate("primary")}>
                  Сделать главным
                </MenuButton>
              ) : null}
              <MenuButton onClick={onEdit}>Редактировать</MenuButton>
              {wish.status !== "acquired" && wish.status !== "archived" ? (
                <MenuButton disabled={loading} onClick={() => mutate("acquired")}>
                  Отметить приобретённым
                </MenuButton>
              ) : null}
              {wish.status !== "archived" ? (
                <MenuButton disabled={loading} onClick={() => mutate("archive")}>
                  Архивировать
                </MenuButton>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          {wish.title}
        </h3>
        {amount ? <p className="text-sm font-medium text-primary">{amount}</p> : null}
        <p className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
          {categoryIcon(wish.category)}
          {wish.category || "Гаджеты"}
        </p>
        <p className="line-clamp-1 break-words text-xs text-zinc-500 dark:text-zinc-500">
          {linkedGoal ? `Цель: ${linkedGoal}` : "Без цели"}
        </p>
        <div className="mt-1 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
          <span className="text-xs text-zinc-600 dark:text-zinc-400">{progress}%</span>
          <ProgressBar value={progress} />
          <span
            className={[
              "rounded-full px-2 py-1 text-xs font-semibold",
              statusClasses(status),
            ].join(" ")}
          >
            {statusLabel(status)}
          </span>
        </div>
      </div>
    </div>
  );
}

function MenuButton({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 disabled:opacity-50 dark:text-zinc-200 dark:hover:bg-white/10"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
      <div
        className="h-full rounded-full bg-primary"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function WishesSidebar({
  categories,
  categoryFilter,
  goalLinks,
  onCategoryChange,
  onEditWish,
  onStatusChange,
  statusCounts,
  statusFilter,
  unlinkedWishes,
}: {
  categories: Array<{ count: number; name: string }>;
  categoryFilter: string | null;
  goalLinks: Array<{ count: number; goal: WishGoalOption }>;
  onCategoryChange: (category: string | null) => void;
  onEditWish: (wish: Wish) => void;
  onStatusChange: (status: WishFilter) => void;
  statusCounts: Record<"acquired" | "archived" | "in_progress" | "wanted", number>;
  statusFilter: WishFilter;
  unlinkedWishes: Wish[];
}) {
  return (
    <aside className="sticky top-[calc(var(--topbar-height)+1.25rem)] grid min-w-0 w-full content-start gap-4">
      <Panel title="Категории">
        <div className="grid gap-1">
          {categories.map((category) => (
            <button
              aria-pressed={categoryFilter === category.name}
              className={[
                "flex min-h-9 items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
                categoryFilter === category.name
                  ? "bg-primary/10 text-primary"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5",
              ].join(" ")}
              key={category.name}
              onClick={() =>
                onCategoryChange(categoryFilter === category.name ? null : category.name)
              }
              type="button"
            >
              {categoryIcon(category.name, categoryFilter === category.name ? "text-primary" : undefined)}
              <span className="min-w-0 flex-1 truncate text-left">{category.name}</span>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Статусы">
        <div className="grid gap-1">
          {(
            [
              ["wanted", "Хочу", "bg-orange-500"],
              ["in_progress", "В процессе", "bg-blue-500"],
              ["acquired", "Приобретено", "bg-emerald-500"],
              ["archived", "Архив", "bg-zinc-500"],
            ] as const
          ).map(([status, label, color]) => (
            <button
              aria-pressed={statusFilter === status}
              className={[
                "flex min-h-9 items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
                statusFilter === status
                  ? "bg-zinc-100 text-zinc-950 dark:bg-white/10 dark:text-zinc-50"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5",
              ].join(" ")}
              key={status}
              onClick={() => onStatusChange(statusFilter === status ? "all" : status)}
              type="button"
            >
              <span className={["h-2.5 w-2.5 rounded-full", color].join(" ")} />
              <span className="flex-1 text-left">{label}</span>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
                {statusCounts[status]}
              </span>
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Связь с целями">
        <div className="grid gap-3">
          {goalLinks.length > 0 ? (
            <>
              {goalLinks.map(({ count, goal }) => (
                <div className="text-sm" key={goal.id}>
                  <p className="line-clamp-1 truncate font-medium text-zinc-950 dark:text-zinc-200">
                    {goal.title}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    {count} желани{count === 1 ? "е" : "й"}
                  </p>
                </div>
              ))}
              {unlinkedWishes.length > 0 ? (
                <div className="border-t border-zinc-200 pt-3 dark:border-white/5">
                  <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                    Не связано ({unlinkedWishes.length})
                  </p>
                  <div className="mt-2 grid gap-1.5">
                    {unlinkedWishes.map((wish) => (
                      <div
                        className="flex min-w-0 items-center justify-between gap-2"
                        key={wish.id}
                      >
                        <p className="min-w-0 flex-1 truncate text-xs text-zinc-700 dark:text-zinc-300">
                          {wish.title}
                        </p>
                        <button
                          className="shrink-0 rounded-lg border border-zinc-200 px-2 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5"
                          onClick={() => onEditWish(wish)}
                          type="button"
                        >
                          Связать
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : unlinkedWishes.length > 0 ? (
            <>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Ни одно желание пока не связано с целью.
              </p>
              <div className="grid gap-1.5">
                {unlinkedWishes.map((wish) => (
                  <div
                    className="flex min-w-0 items-center justify-between gap-2"
                    key={wish.id}
                  >
                    <p className="min-w-0 flex-1 truncate text-xs text-zinc-700 dark:text-zinc-300">
                      {wish.title}
                    </p>
                    <button
                      className="shrink-0 rounded-lg border border-zinc-200 px-2 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5"
                      onClick={() => onEditWish(wish)}
                      type="button"
                    >
                      Связать
                    </button>
                  </div>
                ))}
              </div>
              <Link
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                href="/goals"
              >
                Открыть цели
              </Link>
            </>
          ) : (
            <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Все желания связаны с целями.
            </p>
          )}
        </div>
      </Panel>
    </aside>
  );
}

function Panel({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/5 dark:bg-zinc-900/70">
      <h2 className="mb-3 text-sm font-semibold text-zinc-950 dark:text-zinc-50">{title}</h2>
      {children}
    </div>
  );
}

function WishModal({
  goals,
  onClose,
  wish,
}: {
  goals: WishGoalOption[];
  onClose: () => void;
  wish: EditingWish;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const formKey = useMemo(() => wish?.id ?? "new", [wish?.id]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const body = {
      category: String(formData.get("category") ?? "").trim() || null,
      current_amount: String(formData.get("current_amount") ?? "") || null,
      description: String(formData.get("description") ?? "").trim() || null,
      image_url: String(formData.get("image_url") ?? "").trim() || null,
      is_primary: formData.get("is_primary") === "on",
      linked_goal_id: String(formData.get("linked_goal_id") ?? "") || null,
      status: formData.get("status") ?? "wanted",
      target_amount: String(formData.get("target_amount") ?? "") || null,
      title: String(formData.get("title") ?? "").trim(),
    };

    const response = await fetch(wish ? `/api/wishes/${wish.id}` : "/api/wishes", {
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
      method: wish ? "PUT" : "POST",
    });

    const payload = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      handleMutationError(toast, payload, "Не удалось сохранить желание.");
      return;
    }

    showMutationSuccess(toast, wish ? "Желание сохранено" : "Желание добавлено");
    form.reset();
    onClose();
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/45 p-4 backdrop-blur-sm sm:place-items-center">
      <button
        aria-label="Закрыть"
        className="absolute inset-0"
        onClick={onClose}
        type="button"
      />
      <div className="mobile-sheet-panel relative z-10 w-full max-w-[480px] rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] dark:border-white/10 dark:bg-zinc-900 dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50">
              {wish ? "Редактировать желание" : "Новое желание"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Желание фиксирует мотивацию: зачем цель стоит закрыть.
            </p>
          </div>
          <Button
            aria-label="Закрыть"
            className="h-10 w-10 rounded-full p-0"
            onClick={onClose}
            size="sm"
            variant="secondary"
          >
            <X size={16} />
          </Button>
        </div>

        <form className="mt-6 grid gap-4" key={formKey} onSubmit={submit}>
          <Input defaultValue={wish?.title ?? ""} label="Название" name="title" required />
          <Textarea
            defaultValue={wish?.description ?? ""}
            label="Описание"
            name="description"
            rows={3}
          />
          <Input
            defaultValue={wish?.target_amount ?? ""}
            label="Цена / сумма"
            name="target_amount"
            type="number"
          />
          <Input
            defaultValue={wish?.category ?? ""}
            label="Категория"
            name="category"
            placeholder="Гаджеты"
          />
          <Input
            defaultValue={wish?.image_url ?? ""}
            label="Ссылка на изображение"
            name="image_url"
          />
          <Select
            defaultValue={wish?.linked_goal_id ?? ""}
            label="Связать с целью"
            name="linked_goal_id"
          >
            <option value="">Без цели</option>
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </Select>
          <Select defaultValue={wish?.status ?? "wanted"} label="Статус" name="status">
            <option value="wanted">Хочу</option>
            <option value="acquired">Приобретено</option>
          </Select>
          <Input
            defaultValue={wish?.current_amount ?? ""}
            label="Уже накоплено"
            name="current_amount"
            type="number"
          />
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-3 text-sm text-zinc-950 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-50">
            <input
              className="mt-1 accent-[var(--primary)]"
              defaultChecked={wish?.is_primary ?? false}
              name="is_primary"
              type="checkbox"
            />
            <span>
              <span className="block font-medium">Сделать главным</span>
              <span className="mt-1 block text-zinc-600 dark:text-zinc-400">
                Оно станет главным мотивационным ориентиром на карте.
              </span>
            </span>
          </label>
          <Button
            className="h-12 rounded-xl bg-primary text-base text-white hover:bg-[var(--primary-hover)]"
            loading={loading}
            loadingLabel="Сохраняем..."
            type="submit"
          >
            {wish ? "Сохранить" : "Создать желание"}
          </Button>
        </form>
      </div>
    </div>
  );
}
