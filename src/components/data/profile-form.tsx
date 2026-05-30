"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProfileFormProps = {
  avatarUrl: string | null;
  fullName: string | null;
};

export function ProfileForm({ avatarUrl, fullName }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(formData: FormData) {
    setLoading(true);
    setMessage(null);

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
      setMessage(payload?.error ?? "Не удалось обновить профиль.");
      return;
    }

    setMessage("Профиль обновлен.");
    router.refresh();
  }

  return (
    <form action={submit} className="mt-6 grid gap-4">
      <Input defaultValue={fullName ?? ""} label="Имя" name="full_name" />
      <Input defaultValue={avatarUrl ?? ""} label="Avatar URL" name="avatar_url" />
      <Button loading={loading} type="submit">
        Сохранить профиль
      </Button>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </form>
  );
}
