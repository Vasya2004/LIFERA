'use client';

import { getQueryErrorInfo } from '@/lib/errors';

export default function ErrorState({ error, onRetry }) {
  const info = error
    ? getQueryErrorInfo(error)
    : { title: 'Ошибка' };

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="mb-6 font-bebas text-2xl text-muted-foreground">{info.title}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-xl bg-primary px-5 py-2.5 font-inter text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Повторить
        </button>
      )}
    </div>
  );
}
