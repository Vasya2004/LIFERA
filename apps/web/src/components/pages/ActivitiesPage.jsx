'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import PageContainer from '@/components/PageContainer';
import PageHeader from '@/components/PageHeader';
import PageContent from '@/components/PageContent';
import FilterTabs from '@/components/FilterTabs';
import ActivityCard from '@/components/ActivityCard';
import AddActivityModal from '@/components/AddActivityModal';
import { useEditModal } from '@/hooks/useEditModal';
import { useActivityEntries, useActivityMutations } from '@/hooks/useEntries';

const CATEGORY_FILTERS = [
  { key: 'all', label: 'Все' },
  { key: 'extreme', label: 'Экстрим' },
  { key: 'winter', label: 'Зимние' },
  { key: 'air', label: 'Воздушные' },
  { key: 'water', label: 'Водные' },
  { key: 'sport', label: 'Спорт' },
  { key: 'creative', label: 'Творческие' },
];

export default function ActivitiesPage() {
  const [filter, setFilter] = useState('all');
  const { data, isLoading, isError, error, refetch, setData } = useActivityEntries();
  const entries = data ?? [];
  const { remove } = useActivityMutations();
  const modal = useEditModal();

  const filtered = useMemo(
    () => (filter === 'all' ? entries : entries.filter((e) => e.category === filter)),
    [entries, filter],
  );

  function handleDelete(id) {
    setData((old) => (old ?? []).filter((item) => item.id !== id));
    remove.mutate(id, { onError: () => refetch() });
  }

  return (
    <PageContainer className="py-1 sm:py-2 lg:py-3">
      <PageHeader title="АКТИВНОСТИ" onAdd={modal.openCreate} />

      {entries.length > 0 && (
        <FilterTabs items={CATEGORY_FILTERS} activeKey={filter} onChange={setFilter} />
      )}

      <PageContent
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        isEmpty={!isLoading && entries.length === 0}
        emptyType="activity"
        onAdd={modal.openCreate}
      >
        <div className="poster-grid">
          <AnimatePresence>
            {filtered.map((entry) => (
              <ActivityCard
                key={entry.id}
                entry={entry}
                onEdit={modal.openEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      </PageContent>

      <AddActivityModal
        open={modal.open}
        onClose={modal.close}
        onSaved={refetch}
        editEntry={modal.editEntry}
      />
    </PageContainer>
  );
}
