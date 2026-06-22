import {
  CalendarDays,
  ChartNoAxesCombined,
  CheckCircle2,
  Crown,
  Flame,
  FolderArchive,
  Gem,
  Heart,
  Home,
  Menu,
  Route,
  Settings,
  Wrench,
  Target,
  Banknote,
  Trophy,
  UserRound,
  Bot,
  type LucideIcon,
} from "lucide-react";

type NavIconProps = {
  name: string;
  className?: string;
};

const iconMap: Record<string, LucideIcon> = {
  assistant: Bot,
  award: Trophy,
  billing: Crown,
  calendar: CalendarDays,
  challenge: Route,
  check: CheckCircle2,
  folder: FolderArchive,
  health: Heart,
  heart: Heart,
  home: Home,
  menu: Menu,
  progress: ChartNoAxesCombined,
  ritual: Flame,
  settings: Settings,
  spark: Wrench,
  target: Target,
  user: UserRound,
  wallet: Banknote,
  wish: Gem,
};

export function NavIcon({ className = "", name }: NavIconProps) {
  const Icon = iconMap[name] ?? Home;

  return (
    <Icon
      aria-hidden="true"
      className={["h-5 w-5 shrink-0", className].join(" ")}
      strokeWidth={2.15}
    />
  );
}
