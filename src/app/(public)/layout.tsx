import type { ReactNode } from "react";

import { PublicShellRouter } from "@/components/layout/public-shell-router";

type PublicLayoutProps = {
  children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  return <PublicShellRouter>{children}</PublicShellRouter>;
}
