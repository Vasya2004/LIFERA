"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      className="inline-flex h-[var(--button-height-md)] items-center gap-2 rounded-[var(--radius-control)] border border-danger/25 bg-danger-subtle px-4 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
      onClick={handleSignOut}
      type="button"
    >
      <LogOut className="h-4 w-4" />
      Выйти
    </button>
  );
}
