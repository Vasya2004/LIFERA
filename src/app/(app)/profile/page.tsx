import { Lock, LogOut, ChevronRight, Shield, User } from "lucide-react";

import { ProfileHero } from "@/components/profile/profile-hero";
import { ProfileInfoCards } from "@/components/profile/profile-info-cards";
import { ProfilePersonalAchievements } from "@/components/profile/profile-personal-achievements";
import { ProfileSystemAchievements } from "@/components/profile/profile-system-achievements";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { PageContent } from "@/components/layout/page-content";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/auth/session";

export default async function ProfilePage() {
  const { supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return (
      <PageContent>
        <EmptyState
          description="Войдите в аккаунт, чтобы просмотреть и изменить профиль."
          title="Профиль недоступен"
        />
      </PageContent>
    );
  }

  const [
    { data: profile, error },
    goalsResult,
    wishesResult,
    skillsResult,
    achievementsResult,
  ] = await Promise.all([
    supabase.from("user_profiles").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("goals").select("id,title,status").eq("user_id", user.id),
    supabase
      .from("wishes")
      .select("id,title,is_primary,status")
      .eq("user_id", user.id)
      .neq("status", "archived")
      .order("is_primary", { ascending: false })
      .limit(1),
    supabase
      .from("skills")
      .select("id,title,xp_total,status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("xp_total", { ascending: false })
      .limit(1),
    supabase.from("achievements").select("id,title,status,importance,unlocked_at").eq("user_id", user.id),
  ]);

  if (error || !profile) {
    return (
      <PageContent>
        <Card className="border-danger/25 bg-danger-subtle">
          <h1 className="text-2xl font-semibold tracking-tight">Профиль</h1>
          <p className="mt-3 text-sm leading-6 text-danger-foreground">
            {error
              ? "Не удалось загрузить профиль. Попробуйте обновить страницу."
              : "Профиль ещё не создан. Завершите onboarding или обратитесь в поддержку."}
          </p>
        </Card>
      </PageContent>
    );
  }

  const goals = goalsResult.data ?? [];
  const activeGoals = goals.filter((goal) => goal.status === "active");
  const primaryGoal =
    goals.find((goal) => goal.id === profile.primary_goal_id) ?? activeGoals[0] ?? null;
  const primaryWish = wishesResult.data?.[0] ?? null;
  const mainSkill = skillsResult.data?.[0] ?? null;
  const achievements = (achievementsResult.data ?? []) as Array<{
    id: string;
    title: string;
    status: string;
    importance?: string;
    unlocked_at: string | null;
  }>;
  const allSkillsResult = await supabase
    .from("skills")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  return (
    <PageContent className="lg:grid-cols-[minmax(0,1fr)_var(--right-rail-width)]">
      {/* Main column */}
      <div className="grid content-start gap-5 xl:gap-6">
        <ProfileHero
          avatarUrl={profile.avatar_url}
          fullName={profile.full_name}
          level={profile.level}
          plan={profile.plan}
          streakDays={profile.streak_days ?? 0}
          xpTotal={profile.xp_total ?? 0}
        />

        <ProfileInfoCards
          goalTitle={primaryGoal?.title ?? null}
          skillTitle={mainSkill?.title ?? null}
          wishTitle={primaryWish?.title ?? null}
          xpTotal={profile.xp_total ?? 0}
          stats={{
            achievements: achievements.filter((a) => a.status === "unlocked").length,
            goals: activeGoals.length,
            missions: goals.length,
            skills: allSkillsResult.count ?? 0,
          }}
        />

        <ProfilePersonalAchievements achievements={achievements} />
        <ProfileSystemAchievements achievements={achievements} />
      </div>

      {/* Right aside: outer div is a plain grid child (ensures top alignment);
          inner div is sticky so cards stick on scroll */}
      <div className="min-w-0">
        <div className="grid content-start gap-5 xl:gap-6 lg:sticky lg:top-[calc(var(--topbar-height)+1rem)]">
          <Card className="grid content-start gap-4 p-5">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Аккаунт</h2>
            </div>
            <div className="grid gap-2.5 text-sm">
              <div className="flex items-start justify-between gap-2">
                <span className="shrink-0 text-muted-foreground">Email</span>
                <span className="truncate text-right text-foreground">{user.email ?? "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Регистрация</span>
                <span className="text-foreground">
                  {new Date(profile.created_at).toLocaleDateString("ru-RU")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">План</span>
                <span className="text-foreground">
                  {String(profile.plan ?? "free").toUpperCase()}
                </span>
              </div>
            </div>
          </Card>

          <Card className="grid content-start gap-3 p-5">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Безопасность</h2>
            </div>
            <div className="grid gap-1">
              <a
                className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-muted"
                href="/settings"
              >
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  Смена пароля
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
              <div className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-muted">
                <div className="flex items-center gap-2 text-sm text-danger">
                  <LogOut className="h-3.5 w-3.5" />
                  Выход
                </div>
                <SignOutButton />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContent>
  );
}
