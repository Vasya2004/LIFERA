import type { ReactNode } from "react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

type AppShellProps = {
  children: ReactNode;
  email: string | null;
  profile: {
    fullName: string | null;
    level: number;
    plan: string;
    preferredTheme: "system" | "light" | "dark";
    xpTotal: number;
  } | null;
};

export function AppShell({ children, email, profile }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="md:flex">
        <Sidebar email={email} profile={profile} />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Topbar profile={profile} />
          <main className="flex-1 pb-24 md:pb-0">{children}</main>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
