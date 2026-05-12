export type NavigationItem = {
  href: string;
  label: string;
  description: string;
};

export const navigationItems: NavigationItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Обзор целей, задач, привычек, XP и рекомендаций.",
  },
  {
    href: "/goals",
    label: "Goals",
    description: "Постановка и отслеживание целей.",
  },
  {
    href: "/tasks",
    label: "Tasks",
    description: "Конкретные действия, связанные с целями.",
  },
  {
    href: "/habits",
    label: "Habits",
    description: "Регулярные действия, streak и история выполнения.",
  },
  {
    href: "/achievements",
    label: "Achievements",
    description: "Достижения, уровни и игровые события.",
  },
  {
    href: "/ai-coach",
    label: "AI Coach",
    description: "Помощник для целей, задач, привычек и следующего шага.",
  },
  {
    href: "/profile",
    label: "Profile",
    description: "Профиль пользователя и базовая персонализация.",
  },
  {
    href: "/settings",
    label: "Settings",
    description: "Настройки приложения и приватности.",
  },
];
