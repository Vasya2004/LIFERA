import "server-only";

import { getSupabaseConfig } from "@/lib/supabase/config";

export type SupabaseReadiness = {
  anonKey: boolean;
  configured: boolean;
  serviceRole: boolean;
  url: boolean;
};

export function getSupabaseReadiness(): SupabaseReadiness {
  const { configured, url, anonKey } = getSupabaseConfig();
  const serviceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  return {
    anonKey: Boolean(anonKey),
    configured,
    serviceRole,
    url: Boolean(url),
  };
}

export function getSupabaseReadinessMessage(readiness: SupabaseReadiness): string | null {
  if (!readiness.configured) {
    return "Supabase не настроен: добавьте NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY в .env.local.";
  }

  if (!readiness.serviceRole) {
    return "SUPABASE_SERVICE_ROLE_KEY не задан. Завершение шагов, XP и достижения работать не будут — ключ нужен только на сервере.";
  }

  return null;
}
