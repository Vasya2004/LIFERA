"use client";

import { useState, useTransition, type FormEvent } from "react";
import {
  Landmark,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";

import {
  createFinanceAsset,
  createFinanceDebt,
  deleteFinanceAsset,
  deleteFinanceDebt,
  updateFinanceAsset,
  updateFinanceDebt,
} from "@/actions/finance-portfolio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  FINANCE_ASSET_CATEGORIES,
  FINANCE_ASSET_CATEGORY_LABELS,
  type FinanceAsset,
  type FinanceAssetCategory,
  type FinanceDebt,
  type FinancePortfolioData,
} from "@/lib/domain/finance";
import { formatCurrency, formatDate } from "@/lib/domain/labels";

type FinancePortfolioProps = {
  portfolio: FinancePortfolioData;
};

type AssetModalState = { item: FinanceAsset | null; open: boolean };
type DebtModalState = { item: FinanceDebt | null; open: boolean };

function statTone(value: "asset" | "debt" | "net") {
  if (value === "asset") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300";
  }

  if (value === "debt") {
    return "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300";
  }

  return "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300";
}

function optionalNumber(value: FormDataEntryValue | null) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function NetWorthChart({ data }: { data: FinancePortfolioData["history"] }) {
  const points = data.slice(-8);
  const max = Math.max(1, ...points.map((point) => point.netWorth));
  const min = Math.min(0, ...points.map((point) => point.netWorth));
  const range = Math.max(1, max - min);
  const chartWidth = 680;
  const chartHeight = 180;
  const paddingX = 46;
  const paddingY = 24;
  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;
  const coords = points.map((point, index) => ({
    ...point,
    x: paddingX + (points.length <= 1 ? 0 : (index / (points.length - 1)) * innerWidth),
    y: paddingY + innerHeight - ((point.netWorth - min) / range) * innerHeight,
  }));
  const path = coords.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
            Чистый капитал
          </h2>
          <p className="mt-1 text-sm leading-5 text-zinc-600 dark:text-zinc-400">
            Динамика активов минус обязательства после изменений.
          </p>
        </div>
      </div>

      {points.length < 2 ? (
        <div className="mt-4 grid min-h-[170px] place-items-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-center dark:border-white/10 dark:bg-zinc-950/40">
          <div>
            <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              История появится после нескольких изменений
            </p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Добавьте или обновите активы и долги, чтобы Lifera построила график.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <svg className="min-w-[680px]" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%">
            {[max, Math.round((max + min) / 2), min].map((tick, index) => {
              const y = paddingY + index * (innerHeight / 2);
              return (
                <g key={`${tick}-${index}`}>
                  <line className="stroke-zinc-200 dark:stroke-white/10" x1={paddingX} x2={chartWidth - paddingX} y1={y} y2={y} />
                  <text className="fill-zinc-500 dark:fill-zinc-400" fontSize="11" x={0} y={y + 4}>
                    {Math.round(tick / 1000)} тыс.
                  </text>
                </g>
              );
            })}
            {coords.map((point) => (
              <text className="fill-zinc-500 dark:fill-zinc-400" fontSize="11" key={point.recordedAt} textAnchor="middle" x={point.x} y={chartHeight - 4}>
                {point.label}
              </text>
            ))}
            <path d={path} fill="none" stroke="#059669" strokeWidth={2.5} />
            {coords.map((point) => (
              <circle cx={point.x} cy={point.y} fill="#059669" key={`${point.recordedAt}-dot`} r={4} />
            ))}
          </svg>
        </div>
      )}
    </section>
  );
}

export function FinancePortfolio({ portfolio }: FinancePortfolioProps) {
  const [assetModal, setAssetModal] = useState<AssetModalState>({ item: null, open: false });
  const [debtModal, setDebtModal] = useState<DebtModalState>({ item: null, open: false });
  const netWorthPositive = portfolio.summary.netWorth >= 0;

  return (
    <section className="grid gap-5 xl:gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <FinancePortfolioStat
          icon={<Wallet size={18} />}
          label="Активы"
          tone="asset"
          value={formatCurrency(portfolio.summary.totalAssets)}
        />
        <FinancePortfolioStat
          icon={<Landmark size={18} />}
          label="Долги"
          tone="debt"
          value={formatCurrency(portfolio.summary.totalDebts)}
        />
        <FinancePortfolioStat
          icon={netWorthPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
          label="Чистый капитал"
          tone="net"
          value={formatCurrency(portfolio.summary.netWorth)}
          detail={
            portfolio.summary.totalAssets > 0
              ? `Долговая нагрузка ${portfolio.summary.debtLoad}%`
              : "Добавьте активы для расчёта"
          }
        />
      </div>

      <NetWorthChart data={portfolio.history} />

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Активы</h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Деньги, инвестиции, имущество и другие ресурсы.
              </p>
            </div>
            <Button size="sm" onClick={() => setAssetModal({ item: null, open: true })}>
              <Plus size={15} />
              Актив
            </Button>
          </div>

          <div className="mt-5 grid gap-3">
            {portfolio.assets.length === 0 ? (
              <EmptyPortfolioState
                actionLabel="Добавить актив"
                description="Добавьте первый актив, чтобы видеть капитал и чистую стоимость."
                onAction={() => setAssetModal({ item: null, open: true })}
                title="Активы не добавлены"
              />
            ) : (
              portfolio.assets.map((asset) => (
                <AssetRow
                  asset={asset}
                  key={asset.id}
                  onEdit={() => setAssetModal({ item: asset, open: true })}
                />
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Долги</h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Кредиты, займы и обязательства с остатком.
              </p>
            </div>
            <Button size="sm" onClick={() => setDebtModal({ item: null, open: true })}>
              <Plus size={15} />
              Долг
            </Button>
          </div>

          <div className="mt-5 grid gap-3">
            {portfolio.debts.length === 0 ? (
              <EmptyPortfolioState
                actionLabel="Добавить долг"
                description="Если обязательств нет, оставьте список пустым или зафиксируйте кредиты."
                onAction={() => setDebtModal({ item: null, open: true })}
                title="Долги не добавлены"
              />
            ) : (
              portfolio.debts.map((debt) => (
                <DebtRow
                  debt={debt}
                  key={debt.id}
                  onEdit={() => setDebtModal({ item: debt, open: true })}
                />
              ))
            )}
          </div>
        </section>
      </div>

      {assetModal.open ? (
        <AssetDraftModal
          item={assetModal.item}
          onClose={() => setAssetModal({ item: null, open: false })}
        />
      ) : null}

      {debtModal.open ? (
        <DebtDraftModal item={debtModal.item} onClose={() => setDebtModal({ item: null, open: false })} />
      ) : null}
    </section>
  );
}

function FinancePortfolioStat({
  detail,
  icon,
  label,
  tone,
  value,
}: {
  detail?: string;
  icon: React.ReactNode;
  label: string;
  tone: "asset" | "debt" | "net";
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs uppercase text-zinc-600 dark:text-zinc-400">{label}</p>
        <span className={["grid size-9 place-items-center rounded-xl border", statTone(tone)].join(" ")}>
          {icon}
        </span>
      </div>
      <p className="mt-5 break-words text-2xl font-bold text-zinc-950 dark:text-white">{value}</p>
      {detail ? <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{detail}</p> : null}
    </div>
  );
}

function EmptyPortfolioState({
  actionLabel,
  description,
  onAction,
  title,
}: {
  actionLabel: string;
  description: string;
  onAction: () => void;
  title: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/70 px-4 py-5 dark:border-white/10 dark:bg-zinc-950/35">
      <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">{title}</p>
      <p className="mt-1 text-sm leading-5 text-zinc-600 dark:text-zinc-400">{description}</p>
      <Button className="mt-4" onClick={onAction} size="sm" variant="secondary">
        <Plus size={15} />
        {actionLabel}
      </Button>
    </div>
  );
}

function RowActions({
  disabled,
  onDelete,
  onEdit,
}: {
  disabled: boolean;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        aria-label="Действия"
        className="grid size-8 place-items-center rounded-xl text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-50 dark:hover:bg-white/10 dark:hover:text-zinc-200"
        disabled={disabled}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <MoreHorizontal size={16} />
      </button>
      {open ? (
        <div className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-zinc-200 bg-white p-1 shadow-lg dark:border-white/10 dark:bg-zinc-900">
          <button
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            type="button"
          >
            <Pencil size={14} />
            Редактировать
          </button>
          <button
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            type="button"
          >
            <Trash2 size={14} />
            Удалить
          </button>
        </div>
      ) : null}
    </div>
  );
}

function AssetRow({ asset, onEdit }: { asset: FinanceAsset; onEdit: () => void }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Удалить актив?")) return;
    startTransition(async () => {
      await deleteFinanceAsset(asset.id);
    });
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-100 bg-zinc-50/70 px-4 py-3 dark:border-white/8 dark:bg-zinc-950/30">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">{asset.name}</p>
        <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
          {FINANCE_ASSET_CATEGORY_LABELS[asset.category]} · обновлено {formatDate(asset.updated_at) ?? "—"}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-sm font-bold text-zinc-950 dark:text-zinc-50">
          {formatCurrency(asset.amount)}
        </span>
        <RowActions disabled={isPending} onDelete={handleDelete} onEdit={onEdit} />
      </div>
    </div>
  );
}

function DebtRow({ debt, onEdit }: { debt: FinanceDebt; onEdit: () => void }) {
  const [isPending, startTransition] = useTransition();
  const progress =
    debt.total_amount > 0
      ? Math.round(((debt.total_amount - debt.remaining_amount) / debt.total_amount) * 100)
      : 0;

  function handleDelete() {
    if (!confirm("Удалить долг?")) return;
    startTransition(async () => {
      await deleteFinanceDebt(debt.id);
    });
  }

  return (
    <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 px-4 py-3 dark:border-white/8 dark:bg-zinc-950/30">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">{debt.name}</p>
          <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
            Осталось {formatCurrency(debt.remaining_amount)}
            {debt.monthly_payment ? ` · платёж ${formatCurrency(debt.monthly_payment)}` : ""}
          </p>
        </div>
        <RowActions disabled={isPending} onDelete={handleDelete} onEdit={onEdit} />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
        </div>
        <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{progress}%</span>
      </div>
    </div>
  );
}

function ModalShell({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-zinc-900">
        <button
          aria-label="Закрыть"
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-500 transition hover:text-zinc-950 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:text-white"
          onClick={onClose}
          type="button"
        >
          <X size={16} />
        </button>
        <div className="mb-5 pr-10">
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}

function AssetDraftModal({ item, onClose }: { item: FinanceAsset | null; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const input = {
      amount: Number(formData.get("amount") ?? 0),
      category: String(formData.get("category") ?? "other"),
      currency: String(formData.get("currency") ?? "RUB"),
      name: String(formData.get("name") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    };

    startTransition(async () => {
      try {
        if (item) {
          await updateFinanceAsset(item.id, input);
        } else {
          await createFinanceAsset(input);
        }
        onClose();
      } catch (submitError) {
        setError(submitError instanceof Error ? submitError.message : "Не удалось сохранить актив.");
      }
    });
  }

  return (
    <ModalShell onClose={onClose} title={item ? "Редактировать актив" : "Новый актив"}>
      <form className="grid gap-3" onSubmit={handleSubmit}>
        <Input defaultValue={item?.name ?? ""} disabled={isPending} label="Название" name="name" placeholder="Например: Накопительный счёт" required />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input defaultValue={item?.amount ?? ""} disabled={isPending} label="Сумма" min={0} name="amount" placeholder="150000" required type="number" />
          <Select defaultValue={item?.category ?? "cash"} disabled={isPending} label="Категория" name="category">
            {FINANCE_ASSET_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {FINANCE_ASSET_CATEGORY_LABELS[category as FinanceAssetCategory]}
              </option>
            ))}
          </Select>
        </div>
        <Input defaultValue={item?.currency ?? "RUB"} disabled={isPending} label="Валюта" maxLength={3} name="currency" />
        <Textarea defaultValue={item?.notes ?? ""} disabled={isPending} label="Заметка" name="notes" />
        {error ? <p className="text-sm font-medium text-danger">{error}</p> : null}
        <Button loading={isPending} type="submit">
          {item ? "Сохранить актив" : "Добавить актив"}
        </Button>
      </form>
    </ModalShell>
  );
}

function DebtDraftModal({ item, onClose }: { item: FinanceDebt | null; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const input = {
      deadline: String(formData.get("deadline") ?? "") || null,
      interest_rate: optionalNumber(formData.get("interest_rate")),
      monthly_payment: optionalNumber(formData.get("monthly_payment")),
      name: String(formData.get("name") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      remaining_amount: Number(formData.get("remaining_amount") ?? 0),
      total_amount: Number(formData.get("total_amount") ?? 0),
    };

    startTransition(async () => {
      try {
        if (item) {
          await updateFinanceDebt(item.id, input);
        } else {
          await createFinanceDebt(input);
        }
        onClose();
      } catch (submitError) {
        setError(submitError instanceof Error ? submitError.message : "Не удалось сохранить долг.");
      }
    });
  }

  return (
    <ModalShell onClose={onClose} title={item ? "Редактировать долг" : "Новый долг"}>
      <form className="grid gap-3" onSubmit={handleSubmit}>
        <Input defaultValue={item?.name ?? ""} disabled={isPending} label="Название" name="name" placeholder="Например: Кредит на авто" required />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input defaultValue={item?.total_amount ?? ""} disabled={isPending} label="Общая сумма" min={0} name="total_amount" required type="number" />
          <Input defaultValue={item?.remaining_amount ?? ""} disabled={isPending} label="Остаток" min={0} name="remaining_amount" required type="number" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input defaultValue={item?.monthly_payment ?? ""} disabled={isPending} label="Платёж в месяц" min={0} name="monthly_payment" type="number" />
          <Input defaultValue={item?.interest_rate ?? ""} disabled={isPending} label="Ставка, %" min={0} name="interest_rate" step="0.1" type="number" />
        </div>
        <Input defaultValue={item?.deadline ?? ""} disabled={isPending} label="Дата закрытия" name="deadline" type="date" />
        <Textarea defaultValue={item?.notes ?? ""} disabled={isPending} label="Заметка" name="notes" />
        {error ? <p className="text-sm font-medium text-danger">{error}</p> : null}
        <Button loading={isPending} type="submit">
          {item ? "Сохранить долг" : "Добавить долг"}
        </Button>
      </form>
    </ModalShell>
  );
}
