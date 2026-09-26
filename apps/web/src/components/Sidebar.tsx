"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Archive,
  ChevronDown,
  Clapperboard,
  Gamepad2,
  LayoutGrid,
  LogOut,
  Map,
  Package,
} from "lucide-react";
import { signOut } from "@/app/(app)/areas/actions";

type LifeArea = {
  id: string;
  name: string;
};

const VAULTERA_ITEMS = [
  { label: "Кино", href: "/vaultera/movies", icon: Clapperboard },
  { label: "Игры", href: "/vaultera/games", icon: Gamepad2 },
  { label: "Активности", href: "/vaultera/activities", icon: Activity },
  { label: "Вещи", href: "/vaultera/things", icon: Package },
  { label: "Путешествия", href: "/vaultera/travel", icon: Map },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
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
  const [vaulteraOpen, setVaulteraOpen] = useState(pathname.startsWith("/vaultera"));

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-neutral-800 bg-neutral-950 text-neutral-100">
      <div className="flex items-center gap-2 px-4 py-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/lifera-icon.svg" alt="LIFERA" className="h-7 w-7 shrink-0 rounded-md" />
        <span className="text-sm font-semibold tracking-wide">LIFERA</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 pb-4">
        <div className="mb-1 px-2 pt-2 text-[11px] font-medium uppercase tracking-wider text-neutral-500">
          Модули
        </div>
        <div>
          <button
            type="button"
            onClick={() => setVaulteraOpen((v) => !v)}
            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
              pathname.startsWith("/vaultera")
                ? "bg-neutral-800 text-white"
                : "text-neutral-300 hover:bg-neutral-800/60"
            }`}
          >
            <Archive size={16} className="shrink-0" />
            <span className="flex-1 truncate text-left">VAULTERA</span>
            <ChevronDown
              size={14}
              className={`shrink-0 transition-transform ${vaulteraOpen ? "rotate-180" : ""}`}
            />
          </button>
          {vaulteraOpen && (
            <div className="mt-0.5 flex flex-col gap-0.5 border-l border-neutral-800 pl-3.5 ml-4">
              {VAULTERA_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={pathname === item.href}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mb-1 mt-5 px-2 text-[11px] font-medium uppercase tracking-wider text-neutral-500">
          Мои области жизни
        </div>
        <div className="flex flex-col gap-0.5">
          <NavLink href="/areas" label="Все области" icon={LayoutGrid} active={pathname === "/areas"} />
          {lifeAreas.map((area) => (
            <NavLink
              key={area.id}
              href={`/areas/${area.id}`}
              label={area.name}
              icon={LayoutGrid}
              active={pathname === `/areas/${area.id}`}
            />
          ))}
        </div>
      </nav>

      <div className="border-t border-neutral-800 p-2.5">
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-neutral-400 transition-colors hover:bg-neutral-800/60 hover:text-neutral-200"
          >
            <LogOut size={16} />
            Выйти
          </button>
        </form>
      </div>
    </aside>
  );
}
