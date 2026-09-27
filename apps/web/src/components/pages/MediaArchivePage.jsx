'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import PageContainer from '@/components/PageContainer';
import PageHeader from '@/components/PageHeader';
import PageContent from '@/components/PageContent';
import FilterTabs from '@/components/FilterTabs';
import MediaGrid from '@/components/MediaGrid';
import AddEntryModal from '@/components/AddEntryModal';
import { useEditModal } from '@/hooks/useEditModal';
import { useMediaEntries, useMediaMutations } from '@/hooks/useEntries';

export default function MediaArchivePage({ title, mediaType, tabs, defaultTab }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabKeys = tabs?.map((t) => t.key) ?? [];
  const tabFromUrl = searchParams.get('tab');
  const initialTab = tabKeys.includes(tabFromUrl) ? tabFromUrl : (defaultTab || mediaType);

  const [activeTab, setActiveTab] = useState(initialTab);
  const type = tabs ? activeTab : mediaType;
  const entryType = type === 'all' ? 'movie' : type;

  const { data, isLoading, isError, error, refetch, setData } = useMediaEntries(type);
  const entries = data ?? [];
  const { remove } = useMediaMutations();
  const modal = useEditModal();

  useEffect(() => {
    if (!tabFromUrl || !tabs?.some((t) => t.key === tabFromUrl)) return;
    setActiveTab(tabFromUrl);
  }, [tabFromUrl, tabs]);

  function handleTabChange(key) {
    setActiveTab(key);
    const params = new URLSearchParams(searchParams.toString());
    if (key === defaultTab) params.delete('tab');
    else params.set('tab', key);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function handleDelete(id) {
    setData((old) => (old ?? []).filter((item) => item.id !== id));
    remove.mutate(id, { onError: () => refetch() });
  }

  return (
    <PageContainer className="py-1 sm:py-2 lg:py-3">
      <PageHeader title={title} onAdd={modal.openCreate} />

      {tabs && (
        <FilterTabs items={tabs} activeKey={activeTab} onChange={handleTabChange} />
      )}

      <PageContent
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        isEmpty={!isLoading && entries.length === 0}
        emptyType={type === 'all' ? 'cinema' : type}
        onAdd={modal.openCreate}
      >
        <MediaGrid entries={entries} onEdit={modal.openEdit} onDelete={handleDelete} />
      </PageContent>

      <AddEntryModal
        open={modal.open}
        onClose={modal.close}
        onSaved={refetch}
        activeTab={entryType}
        editEntry={modal.editEntry}
      />
    </PageContainer>
  );
}
