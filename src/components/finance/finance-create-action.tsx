"use client";

import { FinanceEntryModal } from "@/components/finance/finance-entry-modal";
import { PageActionRegistration } from "@/components/layout/page-actions";

export function FinanceCreateAction() {
  return (
    <PageActionRegistration
      actions={<FinanceEntryModal className="w-full sm:w-auto" />}
    />
  );
}
