"use client";

import { PageActionRegistration } from "@/components/layout/page-actions";
import { SkillCreateModal } from "@/components/skills/skill-create-modal";

export function SkillsCreateAction() {
  return (
    <PageActionRegistration
      actions={
        <SkillCreateModal
          className="w-full sm:w-auto"
          label="Создать навык"
        />
      }
    />
  );
}
