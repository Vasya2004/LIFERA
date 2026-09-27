"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Archive,
  CheckSquare,
  Clapperboard,
  Gamepad2,
  LayoutDashboard,
  LayoutGrid,
  ListChecks,
  LogOut,
  Map,
  Package,
  PenLine,
  type LucideIcon,
} from "lucide-react";
import { signOut } from "@/app/(app)/areas/actions";

type LifeArea = {
  id: string;
  name: string;
};

type Section = {
  key: string;
  label: string;
  railLabel: string;
  icon: LucideIcon;
  href: string;
  match: (pathname: string) => boolean;
};

const VAULTERA_ITEMS = [
  { label: "Кино", href: "/vaultera/movies", icon: Clapperboard },
  { label: "Игры", href: "/vaultera/games", icon: Gamepad2 },
  { label: "Активности", href: "/vaultera/activities", icon: Activity },
  { label: "Вещи", href: "/vaultera/things", icon: Package },
  { label: "Путешествия", href: "/vaultera/travel", icon: Map },
];

const DOIT_ITEMS = [
  { label: "Дашборд", href: "/doit/dashboard", icon: LayoutDashboard },
  { label: "Привычки на день", href: "/doit/daily", icon: CheckSquare },
  { label: "Креатор-привычки", href: "/doit/creator", icon: PenLine },
];

const AREAS_SECTION: Section = {
  key: "areas",
  label: "Мои области жизни",
  railLabel: "Области",
  icon: LayoutGrid,
  href: "/areas",
  match: (pathname) => pathname.startsWith("/areas"),
};

const SECTIONS: Section[] = [
  {
    key: "vaultera",
    label: "VAULTERA",
    railLabel: "Vaultera",
    icon: Archive,
    href: "/vaultera/movies",
    match: (pathname) => pathname.startsWith("/vaultera"),
  },
  {
    key: "doit",
    label: "doit",
    railLabel: "doit",
    icon: ListChecks,
    href: "/doit/dashboard",
    match: (pathname) => pathname.startsWith("/doit"),
  },
];

function PanelLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
        active
          ? "bg-neutral-800 text-white"
          : "text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200"
      }`}
    >
      <Icon size={16} className="shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export default function Sidebar({ lifeAreas }: { lifeAreas: LifeArea[] }) {
  const pathname = usePathname();
  const activeSection = SECTIONS.find((s) => s.match(pathname)) ?? AREAS_SECTION;

  return (
    <div className="flex shrink-0 overflow-hidden rounded-3xl bg-black shadow-lg">
      {/* Иконка-полоса */}
      <aside className="flex w-20 shrink-0 flex-col items-center py-3">
        <nav className="flex flex-1 flex-col items-center gap-1.5 px-2">
          <Link
            href="/areas"
            className={`flex w-16 flex-col items-center gap-1 rounded-2xl px-1 py-2.5 transition-colors ${
              activeSection.key === "areas"
                ? "bg-white text-black"
                : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeSection.key === "areas" ? "/brand/lifera-mark.svg" : "/brand/lifera-mark-dark.svg"}
              alt=""
              className="h-5 w-auto shrink-0"
            />
            <span className="w-full truncate text-center text-[10px] font-medium leading-tight">
              Области
            </span>
          </Link>

          <div className="my-1 h-px w-10 shrink-0 bg-neutral-800" />

          {SECTIONS.map((section) => {
            const isActive = section.key === activeSection.key;
            const Icon = section.icon;
            return (
              <Link
                key={section.key}
                href={section.href}
                className={`flex w-16 flex-col items-center gap-1 rounded-2xl px-1 py-2.5 transition-colors ${
                  isActive
                    ? "bg-white text-black"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
                }`}
              >
                <Icon size={20} className="shrink-0" />
                <span className="w-full truncate text-center text-[10px] font-medium leading-tight">
                  {section.railLabel}
                </span>
              </Link>
            );
          })}
        </nav>

        <form action={signOut}>
          <button
            type="submit"
            className="flex w-16 flex-col items-center gap-1 rounded-2xl px-1 py-2.5 text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-neutral-200"
          >
            <LogOut size={20} className="shrink-0" />
            <span className="text-[10px] font-medium leading-tight">Выйти</span>
          </button>
        </form>
      </aside>

      {/* Панель-остров с подразделами активного блока */}
      <aside className="flex w-64 shrink-0 flex-col border-l border-neutral-900 bg-neutral-950 text-neutral-100">
        <div className="px-4 py-4">
          <span className="text-sm font-semibold tracking-wide">{activeSection.label}</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-2.5 pb-4">
          {activeSection.key === "vaultera" && (
            <div className="flex flex-col gap-0.5">
              {VAULTERA_ITEMS.map((item) => (
                <PanelLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={pathname === item.href}
                />
              ))}
            </div>
          )}

          {activeSection.key === "doit" && (
            <div className="flex flex-col gap-0.5">
              {DOIT_ITEMS.map((item) => (
                <PanelLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={pathname === item.href}
                />
              ))}
            </div>
          )}

          {activeSection.key === "areas" && (
            <div className="flex flex-col gap-0.5">
              <PanelLink href="/areas" label="Главный дашборд" icon={LayoutDashboard} active={pathname === "/areas"} />
              {lifeAreas.map((area) => (
                <PanelLink
                  key={area.id}
                  href={`/areas/${area.id}`}
                  label={area.name}
                  icon={LayoutGrid}
                  active={pathname === `/areas/${area.id}`}
                />
              ))}
            </div>
          )}
        </nav>
      </aside>
    </div>
  );
}
