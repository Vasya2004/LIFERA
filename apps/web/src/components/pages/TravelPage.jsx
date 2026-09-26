'use client';

import { AnimatePresence } from 'framer-motion';
import PageContainer from '@/components/PageContainer';
import PageHeader from '@/components/PageHeader';
import PageContent from '@/components/PageContent';
import TravelCard from '@/components/TravelCard';
import AddTravelModal from '@/components/AddTravelModal';
import { useEditModal } from '@/hooks/useEditModal';
import { useTravelEntries, useTravelMutations } from '@/hooks/useEntries';

export default function TravelPage() {
  const { data, isLoading, isError, error, refetch, setData } = useTravelEntries();
  const entries = data ?? [];
  const { remove } = useTravelMutations();
  const modal = useEditModal();

  function handleDelete(id) {
    setData((old) => (old ?? []).filter((item) => item.id !== id));
    remove.mutate(id, { onError: () => refetch() });
  }

  return (
    <PageContainer className="py-4 sm:py-6 lg:py-8">
      <PageHeader title="ПУТЕШЕСТВИЯ" onAdd={modal.openCreate} />

      <PageContent
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        isEmpty={!isLoading && entries.length === 0}
        emptyType="travel"
        onAdd={modal.openCreate}
      >
        <div className="poster-grid">
          <AnimatePresence>
            {entries.map((entry) => (
              <TravelCard
                key={entry.id}
                entry={entry}
                onEdit={modal.openEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      </PageContent>

      <AddTravelModal
        open={modal.open}
        onClose={modal.close}
        onSaved={refetch}
        editEntry={modal.editEntry}
      />
    </PageContainer>
  );
}
