import { Card } from "@/components/ui/card";
import { getSupabaseReadiness, getSupabaseReadinessMessage } from "@/lib/supabase/readiness";

export function SupabaseReadinessBanner() {
  const readiness = getSupabaseReadiness();
  const message = getSupabaseReadinessMessage(readiness);

  if (!message) {
    return null;
  }

  return (
    <Card className="border-[color:var(--border-primary-subtle)] bg-primary-subtle/30">
      <p className="text-sm leading-6 text-foreground">{message}</p>
      {!readiness.serviceRole ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Ключ service role никогда не используется в браузере — только в Route Handlers на сервере.
        </p>
      ) : null}
      {!readiness.configured ? (
        <p className="mt-3 text-xs text-muted-foreground">
          См. раздел Environment Variables в README проекта.
        </p>
      ) : null}
    </Card>
  );
}
