import { CheckCircle, Trophy } from "lucide-react";

import { Card } from "@/components/ui/card";

type ProfileSystemAchievementsProps = {
  achievements: Array<{
    id: string;
    title: string;
    status: string;
  }>;
};

export function ProfileSystemAchievements({ achievements }: ProfileSystemAchievementsProps) {
  const unlocked = achievements.filter((a) => a.status === "unlocked").slice(0, 6);

  if (unlocked.length === 0) {
    return (
      <section className="grid gap-4">
        <h2 className="text-base font-semibold text-foreground">Системные достижения</h2>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">
            Выполняйте привычки и цели — достижения откроются автоматически
          </p>
        </Card>
      </section>
    );
  }

  return (
    <section className="grid gap-4">
      <h2 className="text-base font-semibold text-foreground">Системные достижения</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {unlocked.map((a) => (
          <Card className="flex items-center gap-3 p-4" key={a.id}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#FF5A1F]/25 bg-[#FF5A1F]/10">
              <Trophy className="h-4 w-4 text-[#FF5A1F]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{a.title}</p>
              <p className="text-xs text-muted-foreground">Достигнуто</p>
            </div>
            <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
          </Card>
        ))}
      </div>
    </section>
  );
}
