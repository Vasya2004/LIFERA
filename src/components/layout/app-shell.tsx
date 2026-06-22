import type { ReactNode } from "react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { PageActionsProvider } from "@/components/layout/page-actions";
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
    <div className="app-shell-bg min-h-screen text-foreground">
      <div className="md:flex">
        <Sidebar email={email} profile={profile} />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <PageActionsProvider>
            <Topbar email={email} profile={profile} />
            <main className="min-w-0 flex-1">{children}</main>
          </PageActionsProvider>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
