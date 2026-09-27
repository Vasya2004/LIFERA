'use client';

import { useCallback, useState } from 'react';

/** Shared open / edit / close state for archive modals. */
export function useEditModal() {
  const [open, setOpen] = useState(false);
  const [editEntry, setEditEntry] = useState(null);

  const openCreate = useCallback(() => {
    setEditEntry(null);
    setOpen(true);
  }, []);

  const openEdit = useCallback((entry) => {
    setEditEntry(entry);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setEditEntry(null);
  }, []);

  return { open, editEntry, openCreate, openEdit, close };
}
