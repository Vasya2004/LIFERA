'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import PageContainer from '@/components/PageContainer';
import PageHeader from '@/components/PageHeader';
import PageContent from '@/components/PageContent';
import FilterTabs from '@/components/FilterTabs';
import ThingCard from '@/components/ThingCard';
import AddThingModal from '@/components/AddThingModal';
import { useEditModal } from '@/hooks/useEditModal';
import { useThingEntries, useThingMutations } from '@/hooks/useEntries';

const CATEGORY_FILTERS = [
  { key: 'all', label: 'Все' },
  { key: 'gadget', label: 'Гаджеты' },
  { key: 'tech', label: 'Техника' },
  { key: 'wear', label: 'Носимое' },
  { key: 'home', label: 'Дом' },
  { key: 'collectible', label: 'Коллекция' },
];

export default function ThingsPage() {
  const [filter, setFilter] = useState('all');
  const { data, isLoading, isError, error, refetch, setData } = useThingEntries();
  const entries = data ?? [];
  const { remove } = useThingMutations();
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
    <PageContainer className="py-4 sm:py-6 lg:py-8">
      <PageHeader title="ВЕЩИ" onAdd={modal.openCreate} />

      {entries.length > 0 && (
        <FilterTabs items={CATEGORY_FILTERS} activeKey={filter} onChange={setFilter} />
      )}

      <PageContent
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        isEmpty={!isLoading && entries.length === 0}
        emptyType="thing"
        onAdd={modal.openCreate}
      >
        <div className="poster-grid">
          <AnimatePresence>
            {filtered.map((entry) => (
              <ThingCard
                key={entry.id}
                entry={entry}
                onEdit={modal.openEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      </PageContent>

      <AddThingModal
        open={modal.open}
        onClose={modal.close}
        onSaved={refetch}
        editEntry={modal.editEntry}
      />
    </PageContainer>
  );
}
