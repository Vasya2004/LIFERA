'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Landmark, Pencil, Plus, Trash2, Wallet } from 'lucide-react';
import { useAccounts, useAccountMutations } from '@/hooks/useWealthera';
import { useMovementMutations } from '@/hooks/useWealthera';
import WealtheraModal from '@/components/wealthera/WealtheraModal';

const ACCOUNT_TYPES = [
  { value: 'cash', label: 'Наличные' },
  { value: 'bank', label: 'Банковский счёт' },
  { value: 'broker', label: 'Брокерский счёт' },
  { value: 'crypto', label: 'Криптокошелёк' },
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

function typeLabel(type) {
  return ACCOUNT_TYPES.find((t) => t.value === type)?.label ?? type;
}

function AccountForm({ initial, onSubmit, onCancel, submitLabel }) {
  const [name, setName] = useState(initial?.name ?? '');
  const [type, setType] = useState(initial?.type ?? 'bank');
  const [currency, setCurrency] = useState(initial?.currency ?? 'RUB');
  const [note, setNote] = useState(initial?.note ?? '');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name: name.trim(), type, currency, note: note.trim() });
      }}
      className="space-y-3"
    >
      <div>
        <label className="mb-1 block text-sm font-medium">Название</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Например, «Тинькофф»"
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Тип</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          >
            {ACCOUNT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
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
      <div>
        <label className="mb-1 block text-sm font-medium">Заметка</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Необязательно"
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

function MovementForm({ onSubmit, onCancel }) {
  const [type, setType] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [occurredAt, setOccurredAt] = useState(() => new Date().toISOString().slice(0, 10));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const value = Number(amount);
        if (!value || value <= 0) return;
        onSubmit({ type, amount: value, note: note.trim(), occurred_at: occurredAt });
      }}
      className="space-y-3"
    >
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setType('deposit')}
          className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
            type === 'deposit' ? 'border-black bg-black text-white' : ''
          }`}
        >
          Пополнение
        </button>
        <button
          type="button"
          onClick={() => setType('withdrawal')}
          className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
            type === 'withdrawal' ? 'border-black bg-black text-white' : ''
          }`}
        >
          Снятие
        </button>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Сумма</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Дата</label>
        <input
          type="date"
          value={occurredAt}
          onChange={(e) => setOccurredAt(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Заметка</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Необязательно"
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="rounded-lg px-3 py-2 text-sm">
          Отмена
        </button>
        <button type="submit" className="rounded-lg bg-black px-4 py-2 text-sm text-white">
          Сохранить
        </button>
      </div>
    </form>
  );
}

export default function WealtheraAccountsPage() {
  const { data, isLoading, refetch, setData } = useAccounts();
  const { save, remove } = useAccountMutations();
  const { create: createMovement } = useMovementMutations();

  const accounts = data ?? [];
  const [formOpen, setFormOpen] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  const [movementAccount, setMovementAccount] = useState(null);

  function handleSaveAccount(payload) {
    save.mutate(
      { id: editAccount?.id, data: payload },
      {
        onSuccess: () => {
          setFormOpen(false);
          setEditAccount(null);
          refetch();
        },
      },
    );
  }

  function handleDelete(id) {
    setData((old) => (old ?? []).filter((a) => a.id !== id));
    remove.mutate(id, { onError: () => refetch() });
  }

  function handleMovement(payload) {
    if (!movementAccount) return;
    createMovement.mutate(
      { ...payload, account_id: movementAccount.id },
      {
        onSuccess: () => {
          setMovementAccount(null);
          refetch();
        },
      },
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Счета</h1>
        <button
          type="button"
          onClick={() => {
            setEditAccount(null);
            setFormOpen(true);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-black px-3 py-2 text-sm text-white"
        >
          <Plus size={16} />
          Добавить счёт
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-neutral-500">Загрузка…</p>
      ) : accounts.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Счетов пока нет — добавь первый, чтобы начать отслеживать капитал.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {accounts.map((account) => (
            <li key={account.id} className="rounded-xl border px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <Link href={`/wealthera/accounts/${account.id}`} className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {account.type === 'cash' ? (
                      <Wallet size={16} className="shrink-0 text-neutral-400" />
                    ) : (
                      <Landmark size={16} className="shrink-0 text-neutral-400" />
                    )}
                    <span className="truncate font-medium">{account.name}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-neutral-500">{typeLabel(account.type)}</p>
                </Link>
                <div className="text-right">
                  <p className="font-semibold">{formatMoney(account.balance, account.currency)}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setMovementAccount(account)}
                  className="rounded-lg border px-2.5 py-1.5 text-xs"
                >
                  Пополнить / Снять
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditAccount(account);
                    setFormOpen(true);
                  }}
                  className="flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs"
                >
                  <Pencil size={13} />
                  Изменить
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(account.id)}
                  className="flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs text-red-600"
                >
                  <Trash2 size={13} />
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <WealtheraModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditAccount(null);
        }}
        title={editAccount ? 'Изменить счёт' : 'Новый счёт'}
      >
        <AccountForm
          initial={editAccount}
          submitLabel={editAccount ? 'Сохранить' : 'Создать'}
          onSubmit={handleSaveAccount}
          onCancel={() => {
            setFormOpen(false);
            setEditAccount(null);
          }}
        />
      </WealtheraModal>

      <WealtheraModal
        open={Boolean(movementAccount)}
        onClose={() => setMovementAccount(null)}
        title={movementAccount ? `Движение: ${movementAccount.name}` : ''}
      >
        <MovementForm onSubmit={handleMovement} onCancel={() => setMovementAccount(null)} />
      </WealtheraModal>
    </div>
  );
}
