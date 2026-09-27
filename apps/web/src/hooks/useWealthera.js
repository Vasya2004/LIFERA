'use client';

import { accountApi, holdingApi, movementApi } from '@/lib/wealthera';
import { useArchiveList, createMutations } from '@/hooks/useEntries';
import { clearCachedByPrefix } from '@/lib/archive-cache';

export function useAccounts() {
  return useArchiveList('wealthera:accounts', () => accountApi.list());
}

export function useAccountMutations() {
  return createMutations(accountApi, 'wealthera:accounts');
}

export function useHoldings() {
  return useArchiveList('wealthera:holdings', () => holdingApi.list());
}

export function useHoldingMutations() {
  return createMutations(holdingApi, 'wealthera:holdings');
}

export function useMovements(accountId) {
  return useArchiveList(`wealthera:movements:${accountId}`, () =>
    movementApi.listByAccount(accountId),
  );
}

export function useAllMovements() {
  return useArchiveList('wealthera:movements:all', () => movementApi.listAll());
}

export function useMovementMutations() {
  return {
    create: {
      mutate(payload, options = {}) {
        movementApi
          .create(payload)
          .then((result) => {
            clearCachedByPrefix('wealthera:movements');
            clearCachedByPrefix('wealthera:accounts');
            options.onSuccess?.(result);
          })
          .catch((err) => {
            console.error('Create movement failed:', err);
            options.onError?.(err);
          });
      },
    },
    remove: {
      mutate(id, options = {}) {
        movementApi
          .remove(id)
          .then(() => {
            clearCachedByPrefix('wealthera:movements');
            clearCachedByPrefix('wealthera:accounts');
            options.onSuccess?.();
          })
          .catch((err) => {
            console.error('Delete movement failed:', err);
            options.onError?.(err);
          });
      },
    },
  };
}
