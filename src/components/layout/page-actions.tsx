"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const PageActionsContext = createContext<ReactNode>(null);
const PageActionsSetterContext = createContext<((actions: ReactNode) => void) | null>(null);

export function PageActionsProvider({ children }: { children: ReactNode }) {
  const [actions, setActions] = useState<ReactNode>(null);

  return (
    <PageActionsSetterContext.Provider value={setActions}>
      <PageActionsContext.Provider value={actions}>{children}</PageActionsContext.Provider>
    </PageActionsSetterContext.Provider>
  );
}

export function usePageActions() {
  return useContext(PageActionsContext);
}

export function PageActionRegistration({ actions }: { actions: ReactNode }) {
  const setActions = useContext(PageActionsSetterContext);

  useEffect(() => {
    if (!setActions) {
      return undefined;
    }

    setActions(actions);
    return () => setActions(null);
  }, [actions, setActions]);

  return null;
}
