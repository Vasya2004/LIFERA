import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { getCurrentUser } from "@/lib/auth/session";

type AppLayoutProps = {
  children: ReactNode;
};

export default async function AppLayout({ children }: AppLayoutProps) {
  const { supabase, user } = await getCurrentUser();
  const profile =
    supabase && user
      ? (
          await supabase
            .from("user_profiles")
            .select("full_name,xp_total,level,plan,preferred_theme")
            .eq("user_id", user.id)
            .maybeSingle()
        ).data
      : null;

  return (
    <AppShell
      email={user?.email ?? null}
      profile={
        profile
          ? {
              fullName: profile.full_name,
              level: Number(profile.level ?? 1),
              plan: profile.plan ?? "free",
              preferredTheme: profile.preferred_theme ?? "system",
              xpTotal: Number(profile.xp_total ?? 0),
            }
          : null
      }
    >
      {children}
    </AppShell>
  );
}
