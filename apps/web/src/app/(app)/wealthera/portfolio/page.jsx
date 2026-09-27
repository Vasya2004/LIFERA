'use client';

import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useHoldings, useHoldingMutations } from '@/hooks/useWealthera';
import WealtheraModal from '@/components/wealthera/WealtheraModal';

const ASSET_TYPES = [
  { value: 'stock', label: 'Акция' },
  { value: 'crypto', label: 'Крипта' },
  { value: 'other', label: 'Другое' },
];

const CURRENCIES = ['RUB', 'USD', 'EUR'];

function formatMoney(amount, currency) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function assetTypeLabel(type) {
  return ASSET_TYPES.find((t) => t.value === type)?.label ?? type;
}

function HoldingForm({ initial, onSubmit, onCancel, submitLabel }) {
  const [assetType, setAssetType] = useState(initial?.asset_type ?? 'stock');
  const [ticker, setTicker] = useState(initial?.ticker ?? '');
  const [name, setName] = useState(initial?.name ?? '');
  const [quantity, setQuantity] = useState(initial?.quantity ?? '');
  const [purchasePrice, setPurchasePrice] = useState(initial?.purchase_price ?? '');
  const [currentPrice, setCurrentPrice] = useState(initial?.current_price ?? '');
  const [currency, setCurrency] = useState(initial?.currency ?? 'USD');
  const [purchaseDate, setPurchaseDate] = useState(initial?.purchase_date ?? '');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const qty = Number(quantity);
        const pPrice = Number(purchasePrice);
        const cPrice = Number(currentPrice);
        if (!ticker.trim() || !qty || qty <= 0) return;
        onSubmit({
          asset_type: assetType,
          ticker: ticker.trim().toUpperCase(),
          name: name.trim(),
          quantity: qty,
          purchase_price: pPrice || 0,
          current_price: cPrice || pPrice || 0,
          currency,
          purchase_date: purchaseDate || null,
        });
      }}
      className="space-y-3"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Тип актива</label>
          <select
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          >
            {ASSET_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Тикер</label>
          <input
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            required
            placeholder="AAPL, BTC…"
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Название (необязательно)</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Apple Inc."
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Количество</label>
          <input
            type="number"
            step="any"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Валюта</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Цена покупки</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Текущая цена</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Дата покупки</label>
        <input
          type="date"
          value={purchaseDate ?? ''}
          onChange={(e) => setPurchaseDate(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="rounded-lg px-3 py-2 text-sm">
          Отмена
        </button>
        <button type="submit" className="rounded-lg bg-black px-4 py-2 text-sm text-white">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export default function WealtheraPortfolioPage() {
  const { data, isLoading, refetch, setData } = useHoldings();
  const { save, remove } = useHoldingMutations();
  const holdings = data ?? [];

  const [formOpen, setFormOpen] = useState(false);
  const [editHolding, setEditHolding] = useState(null);

  function handleSave(payload) {
    save.mutate(
      { id: editHolding?.id, data: payload },
      {
        onSuccess: () => {
          setFormOpen(false);
          setEditHolding(null);
          refetch();
        },
      },
    );
  }

  function handleDelete(id) {
    setData((old) => (old ?? []).filter((h) => h.id !== id));
    remove.mutate(id, { onError: () => refetch() });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Портфель</h1>
        <button
          type="button"
          onClick={() => {
            setEditHolding(null);
            setFormOpen(true);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-black px-3 py-2 text-sm text-white"
        >
          <Plus size={16} />
          Добавить актив
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-neutral-500">Загрузка…</p>
      ) : holdings.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Пока нет активов — добавь купленные акции, крипту и т.п.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {holdings.map((h) => {
            const value = h.quantity * h.current_price;
            const cost = h.quantity * h.purchase_price;
            const pnl = value - cost;
            const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
            return (
              <li key={h.id} className="rounded-xl border px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{h.ticker}</span>
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
                        {assetTypeLabel(h.asset_type)}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-neutral-500">
                      {h.name || '—'} · {h.quantity} шт. по {formatMoney(h.purchase_price, h.currency)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatMoney(value, h.currency)}</p>
                    <p className={`text-xs ${pnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {pnl >= 0 ? '+' : ''}
                      {formatMoney(pnl, h.currency)} ({pnlPct >= 0 ? '+' : ''}
                      {pnlPct.toFixed(1)}%)
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditHolding(h);
                      setFormOpen(true);
                    }}
                    className="flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs"
                  >
                    <Pencil size={13} />
                    Обновить цену
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(h.id)}
                    className="flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs text-red-600"
                  >
                    <Trash2 size={13} />
                    Удалить
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <WealtheraModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditHolding(null);
        }}
        title={editHolding ? 'Изменить актив' : 'Новый актив'}
      >
        <HoldingForm
          initial={editHolding}
          submitLabel={editHolding ? 'Сохранить' : 'Добавить'}
          onSubmit={handleSave}
          onCancel={() => {
            setFormOpen(false);
            setEditHolding(null);
          }}
        />
      </WealtheraModal>
    </div>
  );
}
