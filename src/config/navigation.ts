export type NavigationItem = {
  href: string;
  icon: string;
  label: string;
  group: "main" | "core" | "areas" | "intelligence" | "system";
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
    href: "/challenges",
    icon: "challenge",
    label: "Челленджи",
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
    href: "/progress",
    icon: "progress",
    label: "Прогресс",
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
    group: "areas",
  },
  {
    href: "/finance",
    icon: "wallet",
    label: "Финансы",
    group: "areas",
  },
  {
    href: "/health",
    icon: "heart",
    label: "Здоровье",
    group: "areas",
  },
  {
    href: "/ai-assistant",
    icon: "assistant",
    label: "AI Ассистент",
    group: "intelligence",
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
  {
    href: planRouteHref,
    icon: "billing",
    label: "План",
    group: "system",
  },
];

export const mobileNavigationItems = navigationItems.filter((item) => item.mobile);

export const mobilePrimaryNavigationItems = navigationItems.filter((item) =>
  ["/dashboard", "/goals", "/challenges", "/habits"].includes(item.href),
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

  return pathname === href || pathname.startsWith(`${href}/`);
}
