import { Briefcase, GraduationCap, Trophy, Laptop, Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/domain/labels";

type ProfileAchievementsProps = {
  achievements: Array<{
    id: string;
    title: string;
    status: string;
    unlocked_at: string | null;
  }>;
};

const ICONS = [Trophy, GraduationCap, Briefcase, Laptop, Star];

export function ProfilePersonalAchievements({ achievements }: ProfileAchievementsProps) {
  const personal = achievements
    .filter(
      (a) => a.status === "unlocked" && (a as unknown as { importance?: string }).importance !== undefined,
    )
    .slice(0, 4);

  if (personal.length === 0) {
    return (
      <section className="grid gap-4">
        <h2 className="text-base font-semibold text-foreground">Личные достижения</h2>
        <Card className="flex flex-col items-center gap-3 py-10 text-center">
          <Star className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            Выполняйте привычки и цели — достижения откроются автоматически
          </p>
        </Card>
      </section>
    );
  }

  return (
    <section className="grid gap-4">
      <h2 className="text-base font-semibold text-foreground">Личные достижения</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {personal.map((a, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <Card
              className="relative flex flex-col items-center gap-3 border-yellow-500/20 p-5 text-center"
              key={a.id}
              style={{ boxShadow: "0 0 20px rgba(245,158,11,0.08)" }}
            >
              <div className="relative">
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-xl border-2 border-yellow-500/40 bg-yellow-500/10">
                  <Icon className="h-6 w-6 text-yellow-400" />
                </div>
                <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-yellow-400" />
                <span className="absolute -left-1 -top-1 h-1 w-1 rounded-full bg-yellow-400/60" />
                <span className="absolute -bottom-0.5 -right-1 h-1 w-1 rounded-full bg-yellow-400/40" />
                <span className="absolute -bottom-1 -left-0.5 h-1.5 w-1.5 rounded-full bg-yellow-400/50" />
              </div>
              <p className="text-sm font-semibold text-yellow-400">{a.title}</p>
              <div className="grid gap-0.5">
                <p className="text-xs text-muted-foreground">Достижение получено</p>
                <p className="text-xs text-muted-foreground/60">
                  {formatDate(a.unlocked_at) ?? "—"}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
