"use client";

import { HealthEntryButton } from "@/components/health/health-entry-button";
import { PageActionRegistration } from "@/components/layout/page-actions";

export function HealthCreateAction({ hasTodayEntry }: { hasTodayEntry?: boolean }) {
  return (
    <PageActionRegistration
      actions={<HealthEntryButton className="w-full sm:w-auto" label={hasTodayEntry ? "Обновить check-in" : "Добавить check-in"} />}
    />
  );
}
