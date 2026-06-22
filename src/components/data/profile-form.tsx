"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-provider";
import { handleMutationError, showMutationSuccess } from "@/lib/ui/feedback";

type ProfileFormProps = {
  avatarUrl: string | null;
  fullName: string | null;
};

export function ProfileForm({ avatarUrl, fullName }: ProfileFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(formData: FormData) {
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);

    const response = await fetch("/api/me", {
      body: JSON.stringify({
        avatar_url: formData.get("avatar_url"),
        full_name: formData.get("full_name"),
      }),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    });

    setLoading(false);

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      handleMutationError(toast, payload, "Не удалось обновить профиль.");
      setError(payload?.error ?? "Не удалось обновить профиль.");
      return;
    }

    showMutationSuccess(toast, "Изменения сохранены");
    router.refresh();
  }

  return (
    <form action={submit} className="mt-6 grid gap-4">
      <Input defaultValue={fullName ?? ""} label="Имя" name="full_name" />
      <Input defaultValue={avatarUrl ?? ""} label="Avatar URL" name="avatar_url" />
      {error ? <p className="text-sm text-danger-foreground">{error}</p> : null}
      <Button loading={loading} loadingLabel="Сохраняем..." type="submit">
        Сохранить профиль
      </Button>
    </form>
  );
}
