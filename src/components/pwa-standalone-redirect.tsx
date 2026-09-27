"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

type IOSNavigator = Navigator & {
  standalone?: boolean;
};

function isStandalonePwa() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as IOSNavigator).standalone === true
  );
}

export function PWAStandaloneRedirect() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/" && isStandalonePwa()) {
      router.replace("/dashboard");
    }
  }, [pathname, router]);

  return null;
}
