export type NavigationItem = {
  href: string;
  icon: string;
  label: string;
  group: "main" | "core" | "motivation" | "intelligence" | "system";
  disabled?: boolean;
  mobile?: boolean;
};

/** Canonical plan route; `/billing` remains a technical alias. */
export const planRouteHref = "/plan";

export const navigationItems: NavigationItem[] = [
  {
    href: "/dashboard",
    icon: "home",
    label: "Главная",
    group: "main",
    mobile: true,
  },
  {
    href: "/goals",
    icon: "target",
    label: "Цели",
    group: "core",
    mobile: true,
  },
  {
    href: "/habits",
    icon: "ritual",
    label: "Привычки",
    group: "core",
    mobile: true,
  },
  {
    href: "/health",
    icon: "health",
    label: "Здоровье",
    group: "core",
  },
  {
    href: "/finance",
    icon: "wallet",
    label: "Финансы",
    group: "core",
  },
  {
    href: "/achievements",
    icon: "award",
    label: "Достижения",
    group: "core",
  },
  {
    href: "/skills",
    icon: "spark",
    label: "Навыки",
    group: "core",
    mobile: true,
  },
  {
    href: "/ai-assistant",
    icon: "assistant",
    label: "Ассистент",
    group: "intelligence",
  },
  {
    href: planRouteHref,
    icon: "billing",
    label: "План",
    group: "system",
  },
  {
    href: "/profile",
    icon: "user",
    label: "Профиль",
    group: "system",
  },
  {
    href: "/settings",
    icon: "settings",
    label: "Настройки",
    group: "system",
  },
];

export const mobileNavigationItems = navigationItems.filter((item) => item.mobile);

export const mobilePrimaryNavigationItems = navigationItems.filter((item) =>
  ["/dashboard", "/goals", "/habits", "/health"].includes(item.href),
);

export const mobileMoreNavigationItems = navigationItems.filter(
  (item) =>
    !mobilePrimaryNavigationItems.some((primary) => primary.href === item.href) &&
    !["/billing"].includes(item.href),
);

export function isNavigationActive(pathname: string, href: string): boolean {
  if (href === planRouteHref) {
    return pathname === planRouteHref || pathname === "/billing";
  }

  if (href === "/goals") {
    return (
      pathname === href ||
      pathname.startsWith("/goals/") ||
      pathname === "/wishes"
    );
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
