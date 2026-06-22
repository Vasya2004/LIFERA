import Link from "next/link";

import { PageContent } from "@/components/layout/page-content";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AiCoachPage() {
  return (
    <>
      <PageHeader
        description="Этот маршрут сохранён для совместимости. Основной экран — Ассистент Lifera."
        title="Ассистент Lifera"
      />
      <PageContent>
        <Card>
          <p className="text-sm leading-6 text-muted-foreground">
            Рекомендации по целям, привычкам и прогрессу доступны на основном экране
            ассистента. Там используется честный рекомендательный режим без имитации чата с LLM.
          </p>
          <Link className="mt-5 inline-flex" href="/ai-assistant">
            <Button variant="secondary">Открыть ассистента</Button>
          </Link>
        </Card>
      </PageContent>
    </>
  );
}
