"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { PublicShell } from "@/components/layout/public-shell";

type PublicShellRouterProps = {
  children: ReactNode;
};

export function PublicShellRouter({ children }: PublicShellRouterProps) {
  const pathname = usePathname();

  if (
    pathname === "/pricing" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/onboarding"
  ) {
    return <div className="min-h-screen overflow-x-hidden">{children}</div>;
  }

  return <PublicShell>{children}</PublicShell>;
}
