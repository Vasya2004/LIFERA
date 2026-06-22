import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

type AssistantModeCardProps = {
  advancedAiEnabled: boolean;
};

export function AssistantModeCard({ advancedAiEnabled }: AssistantModeCardProps) {
  return (
    <Card className="grid gap-4 p-4 sm:p-5" variant="muted">
      <SectionHeader title="Режим ассистента" />
      <p className="text-sm leading-6 text-muted-foreground">
        {advancedAiEnabled
          ? "Ключ расширенного режима настроен, но сейчас используется базовый рекомендательный режим: анализ целей, привычек, опыта и достижений. Расширенный режим появится позже."
          : "Сейчас Lifera использует базовый рекомендательный режим: анализирует ваши цели, привычки, опыт и достижения. Расширенный режим появится позже."}
      </p>

      <Link href="/plan">
        <Button className="w-full sm:w-auto" size="sm" variant="secondary">
          Открыть план
        </Button>
      </Link>
    </Card>
  );
}
