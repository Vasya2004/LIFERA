"use client";

import { useState, useTransition } from "react";
import { Plus, Repeat, X, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/domain/labels";
import type { FinanceSubscription } from "@/lib/domain/finance";
import {
  createFinanceSubscription,
  updateFinanceSubscription,
  deleteFinanceSubscription,
} from "@/actions/finance-subscriptions";

const CATEGORIES = ["Развлечения", "Работа", "Обучение", "Здоровье", "Связь", "Сервисы", "Другое"];

const PERIODS = [
  { label: "Еженедельно", value: "weekly" },
  { label: "Ежемесячно", value: "monthly" },
  { label: "Ежегодно", value: "yearly" },
];

const STATUSES = [
  { value: "active", label: "Активна" },
  { value: "inactive", label: "Отключена" },
];

export function FinanceSubscriptionsCard({
  subscriptions = [],
}: {
  subscriptions?: FinanceSubscription[];
}) {
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<FinanceSubscription | null>(null);

  const handleEdit = (item: FinanceSubscription) => {
    setEditItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditItem(null);
  };

  const activeTotal = subscriptions
    .filter((s) => s.status === "active")
    .reduce((sum, s) => sum + Number(s.amount), 0);

  return (
    <aside className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
      <div className="flex items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
          <Repeat size={15} />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
            Месячные подписки
          </h2>
          <p className="mt-1 text-sm leading-5 text-zinc-600 dark:text-zinc-400">
            Регулярные списания
          </p>
        </div>
      </div>

      {subscriptions.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/70 px-4 py-4 dark:border-white/10 dark:bg-zinc-950/35">
          <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">Подписок пока нет</p>
          <p className="mt-1 text-sm leading-5 text-zinc-600 dark:text-zinc-400">
            Добавьте регулярные платежи, чтобы видеть нагрузку на бюджет.
          </p>
          <Button
            className="mt-4 h-9 rounded-xl border-emerald-200 bg-white px-3 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:border-emerald-500/35 dark:hover:bg-emerald-500/15"
            onClick={() => setOpen(true)}
            size="sm"
            variant="secondary"
          >
            <Plus size={15} className="mr-1" />
            Добавить подписку
          </Button>
        </div>
      ) : (
        <div className="mt-5 grid gap-4">
          {subscriptions.map((sub) => (
            <SubscriptionItem key={sub.id} sub={sub} onEdit={handleEdit} />
          ))}
          
          <div className="border-t border-zinc-100 pt-4 dark:border-white/8">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-zinc-950 dark:text-zinc-50">Итого в месяц</span>
              <span className="font-bold text-zinc-950 dark:text-zinc-50">
                {formatCurrency(activeTotal)}
              </span>
            </div>
            <Button
              className="mt-4 w-full h-9 rounded-xl border-emerald-200 bg-white px-3 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:border-emerald-500/35 dark:hover:bg-emerald-500/15"
              onClick={() => setOpen(true)}
              size="sm"
              variant="secondary"
            >
              <Plus size={15} className="mr-1" />
              Добавить подписку
            </Button>
          </div>
        </div>
      )}

      {open ? <FinanceSubscriptionDraftModal item={editItem} onClose={handleClose} /> : null}
    </aside>
  );
}

function SubscriptionItem({
  sub,
  onEdit,
}: {
  sub: FinanceSubscription;
  onEdit: (sub: FinanceSubscription) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const isInactive = sub.status === "inactive";

  const handleDelete = () => {
    if (confirm("Удалить подписку?")) {
      startTransition(async () => {
        try {
          await deleteFinanceSubscription(sub.id);
        } catch {
          alert("Не удалось удалить подписку");
        }
      });
    }
  };

  return (
    <div className={`flex items-center justify-between gap-3 ${isInactive ? "opacity-50" : ""}`}>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-950 dark:text-zinc-50">{sub.title}</p>
        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
          {sub.billing_day} число · {sub.category}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          {formatCurrency(sub.amount)}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="grid h-8 w-8 place-items-center rounded-xl text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-white/10 dark:hover:text-zinc-300"
              disabled={isPending}
            >
              <MoreHorizontal size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit(sub)}>
              <Pencil size={14} className="mr-2" /> Редактировать
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600 dark:text-red-400">
              <Trash2 size={14} className="mr-2" /> Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function FinanceSubscriptionDraftModal({
  item,
  onClose,
}: {
  item: FinanceSubscription | null;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);
    
    const title = formData.get("title") as string;
    const amount = Number(formData.get("amount"));
    const category = formData.get("category") as string;
    const billing_day = Number(formData.get("billing_day"));
    const period = formData.get("period") as string;
    const status = formData.get("status") as string;

    startTransition(async () => {
      try {
        if (item) {
          await updateFinanceSubscription(item.id, {
            title, amount, category, billing_day, period, status
          });
        } else {
          await createFinanceSubscription({
            title, amount, category, billing_day, period, status
          });
        }
        onClose();
        // optionally show a toast here if there's a global toast system
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Не удалось сохранить подписку");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-zinc-900">
        <button
          aria-label="Закрыть"
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-500 transition hover:text-zinc-950 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:text-white"
          onClick={onClose}
          type="button"
          disabled={isPending}
        >
          <X size={16} />
        </button>

        <div className="mb-5 pr-10">
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">
            {item ? "Редактировать подписку" : "Новая подписка"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-3">
          <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Название подписки
            <input
              name="title"
              required
              minLength={2}
              defaultValue={item?.title}
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-emerald-500"
              placeholder="Например: Музыкальный сервис"
              disabled={isPending}
            />
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Сумма
            <input
              name="amount"
              type="number"
              required
              min={1}
              max={1000000}
              defaultValue={item?.amount}
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-emerald-500"
              placeholder="299"
              disabled={isPending}
            />
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Категория
            <select
              name="category"
              required
              defaultValue={item?.category ?? CATEGORIES[0]}
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-emerald-500"
              disabled={isPending}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            День списания
            <input
              name="billing_day"
              type="number"
              required
              min={1}
              max={31}
              defaultValue={item?.billing_day ?? 15}
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-emerald-500"
              placeholder="Например: 15"
              disabled={isPending}
            />
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Период
            <select
              name="period"
              required
              defaultValue={item?.period ?? PERIODS[1].value}
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-emerald-500"
              disabled={isPending}
            >
              {PERIODS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Статус
            <select
              name="status"
              required
              defaultValue={item?.status ?? "active"}
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-emerald-500"
              disabled={isPending}
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </label>

          {errorMsg && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">{errorMsg}</p>
          )}

          <div className="mt-5 flex justify-end gap-3">
            <Button type="button" onClick={onClose} size="sm" variant="secondary" disabled={isPending}>
              Отмена
            </Button>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "Сохраняем..." : item ? "Сохранить" : "Добавить подписку"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
