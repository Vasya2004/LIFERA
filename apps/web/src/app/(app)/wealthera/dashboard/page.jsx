'use client';

import Link from 'next/link';
import { useAccounts, useHoldings, useAllMovements } from '@/hooks/useWealthera';

function formatMoney(amount, currency) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function buildSparklinePoints(movements) {
  if (movements.length === 0) return null;
  let running = 0;
  const points = movements.map((m) => {
    running += m.type === 'deposit' ? m.amount : -m.amount;
    return running;
  });
  const min = Math.min(0, ...points);
  const max = Math.max(0, ...points);
  const span = max - min || 1;
  const width = 100;
  const height = 32;
  const step = points.length > 1 ? width / (points.length - 1) : 0;

  const coords = points.map((value, i) => {
    const x = points.length > 1 ? i * step : width / 2;
    const y = height - ((value - min) / span) * height;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  return { coords: coords.join(' '), last: points[points.length - 1] };
}

export default function WealtheraDashboardPage() {
  const { data: accountsData, isLoading: accountsLoading } = useAccounts();
  const { data: holdingsData, isLoading: holdingsLoading } = useHoldings();
  const { data: movementsData } = useAllMovements();

  const accounts = accountsData ?? [];
  const holdings = holdingsData ?? [];
  const movements = movementsData ?? [];

  const totalsByCurrency = new Map();

  for (const account of accounts) {
    const entry = totalsByCurrency.get(account.currency) ?? { cash: 0, portfolio: 0 };
    entry.cash += account.balance;
    totalsByCurrency.set(account.currency, entry);
  }

  for (const holding of holdings) {
    const entry = totalsByCurrency.get(holding.currency) ?? { cash: 0, portfolio: 0 };
    entry.portfolio += holding.quantity * holding.current_price;
    totalsByCurrency.set(holding.currency, entry);
  }

  const currencyRows = Array.from(totalsByCurrency.entries()).map(([currency, { cash, portfolio }]) => ({
    currency,
    cash,
    portfolio,
    total: cash + portfolio,
  }));

  const isLoading = accountsLoading || holdingsLoading;

  const movementsByCurrency = new Map();
  for (const m of movements) {
    const account = accounts.find((a) => a.id === m.account_id);
    const currency = account?.currency ?? 'RUB';
    if (!movementsByCurrency.has(currency)) movementsByCurrency.set(currency, []);
    movementsByCurrency.get(currency).push(m);
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">WEALTHERA</h1>

      {isLoading ? (
        <p className="text-sm text-neutral-500">Загрузка…</p>
      ) : currencyRows.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Пока нет данных — добавь{' '}
          <Link href="/wealthera/accounts" className="underline">
            счёт
          </Link>{' '}
          или{' '}
          <Link href="/wealthera/portfolio" className="underline">
            актив
          </Link>
          .
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {currencyRows.map((row) => {
            const sparkline = buildSparklinePoints(movementsByCurrency.get(row.currency) ?? []);
            return (
              <div key={row.currency} className="rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-500">Капитал в {row.currency}</p>
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
                    {row.currency}
                  </span>
                </div>
                <p className="mt-1 text-2xl font-semibold">{formatMoney(row.total, row.currency)}</p>
                <div className="mt-2 flex gap-4 text-xs text-neutral-500">
                  <span>Счета: {formatMoney(row.cash, row.currency)}</span>
                  <span>Портфель: {formatMoney(row.portfolio, row.currency)}</span>
                </div>
                {sparkline && (
                  <svg viewBox="0 0 100 32" className="mt-3 h-8 w-full" preserveAspectRatio="none">
                    <polyline
                      points={sparkline.coords}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-emerald-600"
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex gap-3 text-sm">
        <Link href="/wealthera/accounts" className="rounded-lg border px-3 py-2">
          Счета →
        </Link>
        <Link href="/wealthera/portfolio" className="rounded-lg border px-3 py-2">
          Портфель →
        </Link>
      </div>
    </div>
  );
}
