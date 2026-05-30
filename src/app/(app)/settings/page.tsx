import Link from "next/link";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { PageTitle } from "@/components/layout/page-title";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import { PLAN_LABELS } from "@/lib/domain/plan-catalog";
import { getUserPlan } from "@/lib/domain/subscription";

export default async function SettingsPage() {
  const { supabase, user } = await getCurrentUser();
  const profile =
    supabase && user
      ? (
          await supabase
            .from("user_profiles")
            .select("full_name, preferred_theme, plan")
            .eq("user_id", user.id)
            .maybeSingle()
        ).data
      : null;

  const currentPlan =
    supabase && user ? await getUserPlan(supabase, user.id) : ("free" as const);

  return (
    <section className="mx-auto grid max-w-3xl gap-6 px-5 py-8 sm:px-8">
      <PageTitle
        subtitle="Аккаунт, тема и базовые параметры MVP."
        title="Настройки"
      />

      <Card>
        <h2 className="text-lg font-semibold">Аккаунт</h2>
        <dl className="mt-4 grid gap-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium">{user?.email ?? "—"}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">Имя</dt>
            <dd className="font-medium">{profile?.full_name ?? "—"}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">План</dt>
            <dd>
              <Badge variant="muted">{PLAN_LABELS[currentPlan]}</Badge>
            </dd>
          </div>
        </dl>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
            href="/profile"
          >
            Открыть профиль
          </Link>
          <Link
            className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
            href="/plan"
          >
            Управление планом
          </Link>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Внешний вид</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Тема сохраняется в профиле и локально.
            </p>
          </div>
          <ThemeToggle initialTheme={profile?.preferred_theme ?? "system"} />
        </div>
      </Card>

      <Card variant="muted">
        <h2 className="text-lg font-semibold">Скоро</h2>
        <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
          <li>Уведомления — in-app и email</li>
          <li>Экспорт данных и резервная копия</li>
          <li>Расширенные параметры приватности</li>
        </ul>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Сессия</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Выйти из аккаунта на этом устройстве.
        </p>
        <div className="mt-4">
          <SignOutButton />
        </div>
      </Card>
    </section>
  );
}
