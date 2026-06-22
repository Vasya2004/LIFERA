import { BookOpen, Heart, Target, TrendingUp, Trophy, Zap } from "lucide-react";

import { Card } from "@/components/ui/card";
import { calculateLevel } from "@/lib/domain/gamification";

type ProfileInfoCardsProps = {
  goalTitle: string | null;
  skillTitle: string | null;
  wishTitle: string | null;
  xpTotal: number;
  stats: {
    achievements: number;
    goals: number;
    missions: number;
    skills: number;
  };
};

function CardHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#FF5A1F]/20 bg-[#FF5A1F]/10">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
    </div>
  );
}

function FocusRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="grid gap-0.5">
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

export function ProfileInfoCards({
  goalTitle,
  skillTitle,
  wishTitle,
  xpTotal,
  stats,
}: ProfileInfoCardsProps) {
  const { level, nextLevelXp, levelProgress: progress } = calculateLevel(xpTotal);
  const xpNeeded = nextLevelXp - xpTotal;

  const growthStats = [
    { label: "Целей", value: stats.goals },
    { label: "Привычек", value: stats.missions },
    { label: "Навыков", value: stats.skills },
    { label: "Достижений", value: stats.achievements },
  ];

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      {/* Главное сейчас */}
      <Card className="grid gap-5 p-6">
        <CardHeader
          icon={<Target className="h-4 w-4 text-[#FF5A1F]" />}
          title="Главное сейчас"
        />
        <div className="grid gap-4">
          <FocusRow
            icon={<Target className="h-3 w-3" />}
            label="Цель"
            value={goalTitle ?? "Не выбрано"}
          />
          <div className="h-px bg-border/50" />
          <FocusRow
            icon={<Heart className="h-3 w-3" />}
            label="Желание"
            value={wishTitle ?? "Не выбрано"}
          />
          <div className="h-px bg-border/50" />
          <FocusRow
            icon={<BookOpen className="h-3 w-3" />}
            label="Навык"
            value={skillTitle ?? "Не выбран"}
          />
        </div>
      </Card>

      {/* Рост */}
      <Card className="grid gap-5 p-6">
        <CardHeader
          icon={<TrendingUp className="h-4 w-4 text-[#FF5A1F]" />}
          title="Рост"
        />
        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
          {growthStats.map((item) => (
            <div className="grid gap-1" key={item.label}>
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {item.value}
              </span>
              <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* До следующего уровня */}
      <Card className="grid gap-5 p-6">
        <CardHeader
          icon={<Zap className="h-4 w-4 text-[#FF5A1F]" />}
          title="До следующего уровня"
        />
        <div className="grid gap-4">
          <div className="flex items-end justify-between gap-3">
            <div className="grid gap-0.5">
              <span className="text-3xl font-bold tracking-tight text-foreground">
                {xpNeeded} XP
              </span>
              <span className="text-xs text-muted-foreground">осталось набрать</span>
            </div>
            <span className="mb-0.5 rounded-full bg-green-500/15 px-2.5 py-1 text-sm font-semibold text-green-500 dark:text-green-400">
              {progress}%
            </span>
          </div>

          <div className="grid gap-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-[#FF5A1F] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Уровень {level}</span>
              <span>Уровень {level + 1}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-surface-muted/60 px-3 py-2.5">
            <Trophy className="h-3.5 w-3.5 shrink-0 text-[#FF5A1F]" />
            <span className="text-xs text-muted-foreground">
              Набрано <span className="font-semibold text-foreground">{xpTotal} XP</span> из{" "}
              <span className="font-semibold text-foreground">{nextLevelXp} XP</span>
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
