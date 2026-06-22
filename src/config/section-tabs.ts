export type SectionTab = {
  href: string;
  icon: string;
  label: string;
};

const tabsByRoute: Array<{ match: (pathname: string) => boolean; tabs: SectionTab[] }> = [
  {
    match: (pathname) => pathname === "/dashboard",
    tabs: [
      { href: "?view=overview", icon: "home", label: "Обзор" },
      { href: "?view=focus", icon: "target", label: "Фокус" },
      { href: "?view=progress", icon: "progress", label: "Прогресс" },
    ],
  },
  {
    match: (pathname) => /^\/goals\/[^/]+/.test(pathname) && pathname !== "/goals/wishes",
    tabs: [
      { href: "#overview", icon: "target", label: "Обзор" },
      { href: "#goal-plan", icon: "challenge", label: "План цели" },
      { href: "#rituals", icon: "ritual", label: "Привычки" },
      { href: "#progress", icon: "progress", label: "Прогресс" },
      { href: "#wish", icon: "wish", label: "Желание" },
      { href: "#assistant", icon: "assistant", label: "Ассистент" },
    ],
  },
  {
    match: (pathname) => pathname === "/goals",
    tabs: [
      { href: "/goals", icon: "target", label: "Цели" },
      { href: "/goals/wishes", icon: "wish", label: "Карта желаний" },
    ],
  },
  {
    match: (pathname) => /^\/challenges\/[^/]+/.test(pathname),
    tabs: [
      { href: "#overview", icon: "challenge", label: "Обзор" },
      { href: "#stages", icon: "check", label: "Этапы" },
      { href: "#progress", icon: "progress", label: "Прогресс" },
      { href: "#settings", icon: "settings", label: "Настройки" },
    ],
  },
  {
    match: (pathname) => pathname === "/challenges",
    tabs: [
      { href: "#active", icon: "challenge", label: "Активные" },
      { href: "#templates", icon: "spark", label: "Шаблоны" },
      { href: "#paused", icon: "calendar", label: "На паузе" },
      { href: "#create-challenge", icon: "check", label: "Новая привычка" },
    ],
  },
  {
    match: (pathname) => pathname === "/habits",
    tabs: [
      { href: "?view=today", icon: "ritual", label: "Сегодня" },
      { href: "?view=missions", icon: "check", label: "Мои привычки" },
    ],
  },
  {
    match: (pathname) => pathname === "/goals/wishes" || pathname === "/wishes",
    tabs: [
      { href: "/goals", icon: "target", label: "Цели" },
      { href: "/goals/wishes", icon: "wish", label: "Карта желаний" },
    ],
  },
  {
    match: (pathname) => pathname === "/skills",
    tabs: [
      { href: "?view=focus", icon: "spark", label: "Фокус" },
      { href: "?view=all", icon: "award", label: "Все навыки" },
    ],
  },
  {
    match: (pathname) => pathname === "/health",
    tabs: [
      { href: "?view=overview", icon: "health", label: "Обзор" },
      { href: "?view=body-map", icon: "target", label: "Карта тела" },
      { href: "?view=history", icon: "folder", label: "История" },
    ],
  },
  {
    match: (pathname) => pathname === "/finance",
    tabs: [
      { href: "?view=overview", icon: "wallet", label: "Обзор" },
      { href: "?view=history", icon: "folder", label: "История" },
    ],
  },
  {
    match: (pathname) => pathname === "/progress",
    tabs: [
      { href: "#overview", icon: "progress", label: "Обзор" },
      { href: "#week", icon: "calendar", label: "Неделя" },
      { href: "#life-areas", icon: "spark", label: "Сферы" },
      { href: "#history", icon: "folder", label: "История" },
    ],
  },
  {
    match: (pathname) => pathname === "/achievements",
    tabs: [
      { href: "?view=all", icon: "award", label: "Все" },
      { href: "?view=personal", icon: "user", label: "Личные" },
      { href: "?view=system", icon: "shield", label: "Системные" },
    ],
  },
  {
    match: (pathname) => pathname === "/ai-assistant",
    tabs: [
      { href: "#chat", icon: "assistant", label: "Чат" },
      { href: "#context", icon: "target", label: "Контекст" },
    ],
  },
  {
    match: (pathname) => pathname === "/plan" || pathname === "/billing",
    tabs: [
      { href: "#current-plan", icon: "billing", label: "Текущий план" },
      { href: "#comparison", icon: "progress", label: "Сравнение" },
      { href: "#features", icon: "spark", label: "Возможности" },
    ],
  },
  {
    match: (pathname) => pathname === "/profile",
    tabs: [
      { href: "#profile", icon: "user", label: "Профиль" },
      { href: "#progress", icon: "progress", label: "Прогресс" },
      { href: "#account", icon: "settings", label: "Аккаунт" },
    ],
  },
  {
    match: (pathname) => pathname === "/settings",
    tabs: [
      { href: "#main", icon: "settings", label: "Основные" },
      { href: "#appearance", icon: "spark", label: "Внешний вид" },
      { href: "#account", icon: "user", label: "Аккаунт" },
    ],
  },
];

export function getSectionTabs(pathname: string) {
  return tabsByRoute.find((item) => item.match(pathname))?.tabs ?? [];
}
