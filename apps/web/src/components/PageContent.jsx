'use client';

import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';

/** Shared loading / error / empty / content states for archive pages. */
export default function PageContent({
  isLoading,
  isError,
  error,
  onRetry,
  isEmpty,
  emptyType,
  onAdd,
  children,
}) {
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState error={error} onRetry={onRetry} />;
  if (isEmpty) return <EmptyState type={emptyType} onAdd={onAdd} />;
  return children;
}
