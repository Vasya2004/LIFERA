'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useAccounts } from '@/hooks/useWealthera';
import { useMovements, useMovementMutations } from '@/hooks/useWealthera';
import WealtheraModal from '@/components/wealthera/WealtheraModal';

function formatMoney(amount, currency) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency ?? 'RUB',
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr) {
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(dateStr),
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

export default function AccountMovementsPage({ params }) {
  const { id } = use(params);
  const { data: accounts } = useAccounts();
  const account = (accounts ?? []).find((a) => a.id === id);

  const { data, isLoading, refetch, setData } = useMovements(id);
  const { create, remove } = useMovementMutations();
  const movements = data ?? [];

  const [formOpen, setFormOpen] = useState(false);

  function handleCreate(payload) {
    create.mutate(
      { ...payload, account_id: id },
      {
        onSuccess: () => {
          setFormOpen(false);
          refetch();
        },
      },
    );
  }

  function handleDelete(movementId) {
    setData((old) => (old ?? []).filter((m) => m.id !== movementId));
    remove.mutate(movementId, { onError: () => refetch() });
  }

  return (
    <div>
      <Link href="/wealthera/accounts" className="mb-4 flex items-center gap-1.5 text-sm text-neutral-500">
        <ArrowLeft size={15} />
        Все счета
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{account?.name ?? 'Счёт'}</h1>
          {account && (
            <p className="mt-1 text-sm text-neutral-500">
              Текущий баланс: <span className="font-medium text-neutral-900">{formatMoney(account.balance, account.currency)}</span>
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="rounded-lg bg-black px-3 py-2 text-sm text-white"
        >
          + Движение
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-neutral-500">Загрузка…</p>
      ) : movements.length === 0 ? (
        <p className="text-sm text-neutral-500">Движений пока нет.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {movements.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm">
                  {m.type === 'deposit' ? 'Пополнение' : 'Снятие'}
                  {m.note ? <span className="text-neutral-400"> — {m.note}</span> : null}
                </p>
                <p className="text-xs text-neutral-500">{formatDate(m.occurred_at)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`font-semibold ${m.type === 'deposit' ? 'text-emerald-600' : 'text-red-600'}`}
                >
                  {m.type === 'deposit' ? '+' : '−'}
                  {formatMoney(m.amount, account?.currency)}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(m.id)}
                  className="text-neutral-400 hover:text-red-600"
                  aria-label="Удалить движение"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <WealtheraModal open={formOpen} onClose={() => setFormOpen(false)} title="Новое движение">
        <MovementForm onSubmit={handleCreate} onCancel={() => setFormOpen(false)} />
      </WealtheraModal>
    </div>
  );
}
