import { SignOutButton } from "@/components/auth/sign-out-button";
import { ProfileForm } from "@/components/data/profile-form";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import { demoProfile } from "@/lib/domain/demo";

export default async function ProfilePage() {
  const { supabase, user } = await getCurrentUser();
  const profile =
    supabase && user
      ? (await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()).data ??
        demoProfile
      : demoProfile;

  return (
    <section className="mx-auto grid max-w-4xl gap-6 px-5 py-8 sm:px-8">
      <Card>
        <h1 className="text-3xl font-semibold tracking-tight">Профиль</h1>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">Имя</dt>
            <dd className="mt-1 font-medium">{profile.full_name ?? "Без имени"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Email</dt>
            <dd className="mt-1 font-medium">{user?.email ?? "demo@example.com"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Level</dt>
            <dd className="mt-1 font-medium">{profile.level}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">XP</dt>
            <dd className="mt-1 font-medium">{profile.xp_total}</dd>
          </div>
        </dl>
        <div className="mt-6">
          <SignOutButton />
        </div>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold">Редактировать профиль</h2>
        <ProfileForm avatarUrl={profile.avatar_url} fullName={profile.full_name} />
      </Card>
    </section>
  );
}
